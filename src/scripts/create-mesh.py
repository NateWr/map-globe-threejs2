# Blender script to generate a 3D globe with
# meshes for each country from geojson boundaries
#
# @see https://medium.com/@kimberlysiva/creating-world-pieces-in-blender-309b67936d93

import bpy
import json
import math
import mathutils

GEOJSON_FILE = '/home/nate/Projects/map-globe-threejs2/public/countries.geojson'
RADIUS = 100      # the size of our globe
THICKNESS = 1  # the thickness of each piece

def parse_geojson(path):
    file = open(path)
    data = json.load(file)
    for feature in data['features']:
        name = feature['properties']['name']
        if feature['geometry']['type'] == 'Polygon':
            create_piece(feature['geometry']['coordinates'], name)
        elif feature['geometry']['type'] == 'MultiPolygon':
            objects = []
            for part in feature['geometry']['coordinates']:
                objects.append(create_piece(part, name))
            join_objects(objects, name)

def create_piece(coordinates, name):
    piece = create_outline(coordinates[0], name)
    extrude_outline(add_faces=True)
    apply_boolean(piece, SPHERE, 'INTERSECT')
    #bpy.ops.object.shade_smooth(use_auto_smooth=True)
    fix_normals()
    if len(coordinates) > 1:
        for coords in coordinates[1:]:
            cut_hole(piece, coords)
        fix_normals()
    return piece

def deselect_all():
    for obj in bpy.context.selected_objects:
        obj.select_set(False)

def select_object(obj):
    deselect_all()
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj

def join_objects(objects, name):
    select_object(objects[0])
    for obj in objects:
        obj.select_set(True)
    bpy.ops.object.join()
    bpy.context.active_object.name = name
    bpy.context.active_object.data.name = name

def coord_to_vert(coord):
    lat = math.radians(coord[1])
    lon = math.radians(coord[0])
    x = RADIUS * math.cos(lat) * math.cos(lon)
    y = RADIUS * math.cos(lat) * math.sin(lon)
    z = RADIUS * math.sin(lat)
    return [x, y, z]

def create_outline(coordinates, name):
    verts = [coord_to_vert(coord) for coord in coordinates]
    edges = [[i, i + 1] for i in range(len(verts))]
    edges[len(edges) - 1][1] = 0 # wrap around
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, edges, [])
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    select_object(obj)
    return obj

def create_sphere():
    bpy.ops.mesh.primitive_uv_sphere_add(radius=RADIUS, segments=100, ring_count=50)
    bpy.ops.object.modifier_add(type='SOLIDIFY')
    bpy.context.object.modifiers["Solidify"].thickness = THICKNESS
    bpy.context.object.modifiers["Solidify"].offset = -1.0
    bpy.ops.object.modifier_apply(modifier="Solidify")
    return bpy.context.active_object

SPHERE = create_sphere()

def extrude_outline(add_faces):
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_mode(type='EDGE')
    if add_faces: bpy.ops.mesh.edge_face_add()
    bpy.ops.transform.resize(value=(1.1,1.1,1.1), center_override=(0.0, 0.0, 0.0))
    bpy.ops.mesh.extrude_region_move(TRANSFORM_OT_translate={"value":(0,0,0)})
    bpy.ops.transform.resize(value=(0.8,0.8,0.8), center_override=(0.0, 0.0, 0.0))
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode='OBJECT')

def apply_boolean(modify, target, operation):
    select_object(modify)
    bpy.ops.object.modifier_add(type='BOOLEAN')
    bpy.context.object.modifiers["Boolean"].object = target
    bpy.context.object.modifiers["Boolean"].operation = operation
    bpy.ops.object.modifier_apply(modifier="Boolean")

def fix_normals():
    mesh = bpy.context.object.data
    # mesh.calc_normals_split()
    normals = []
    for loop in mesh.loops:
        dir = mesh.vertices[loop.vertex_index].co.normalized()
        angle = math.degrees(loop.normal.angle(dir))
        if angle < 10:
            normals.append(dir)
        elif angle > 170:
            normals.append(-dir)
        else:
            normals.append(loop.normal)
    mesh.normals_split_custom_set(normals)

def cut_hole(piece, coordinates):
    hole = create_outline(coordinates, "hole")
    extrude_outline(add_faces=True)
    apply_boolean(piece, hole, 'DIFFERENCE')
    select_object(hole)
    bpy.ops.object.delete(confirm=False)
    select_object(piece)

parse_geojson(GEOJSON_FILE)