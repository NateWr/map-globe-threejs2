# Blender script to delete all faces of a mesh
# except the "surface" meshes of the countries
#
# This changes the meshes from extruded shapes
# to "flat" planes to reduce polycount.
#
# To use this script, select all country meshes
# and put them into edit mode. After running
# the script, all the "back" faces will be
# selected. Delete them.
#
# @see https://blender.stackexchange.com/questions/239466/face-selection-by-condition

import bpy
import bmesh
from math import radians

context = bpy.context

for ob in bpy.context.scene.objects:

    me = ob.data

    bm = bmesh.from_edit_mesh(me)
    for f in bm.faces:
        f.select_set(f.normal.angle(f.calc_center_median()) > radians(80))

    bmesh.update_edit_mesh(me)