import os
import phydrus as ps

# Folder for Hydrus files to be stored
ws = "example_1" # Directory
exe = r"C:\Program Files (x86)\PC-Progress\Hydrus-1D 4.xx\HYDRUS1D.EXE"

# Description
desc = "Infiltration of Water into a Single-Layered Soil Profile"

# Create model
ml = ps.Model(
    exe_name=exe,
    ws_name=ws,
    name="model",
    description=desc,
    mass_units="mmol",
    time_unit="days",
    length_unit="cm",
    print_screen=True,
)

ml.basic_info["lFlux"] = True
ml.basic_info["lShort"] = False

ml.add_time_info(tmax=1, print_times=True, nsteps=12, dt=0.001)

ml.add_waterflow(top_bc=0, bot_bc=4)

m = ml.get_empty_material_df(n=1)
m.loc[[1]] = [[0.078, 0.43, 0.036, 1.56, 24.96, 0.5]]
ml.add_material(m)

elements = 100  # Disctretize soil column into n elements
depth = -100  # Depth of the soil column
ihead = -100  # Determine initial Pressure Head
# Create Profile
profile = ps.create_profile(bot=depth, dx=abs(depth / elements), h=ihead)
profile.iloc[0, 1] = 1  # Define initial Pressure Head at the surface
ml.add_profile(profile)  # Add the profile

# Add observation nodes at depth
ml.add_obs_nodes([-20, -40, -60, -80, -100])

ml.write_input()
res = ml.simulate()
print(res)

# ml.plots.obs_points()
# ml.plots.profile_information()
# ml.plots.profile_information("Water Content")
# ml.plots.water_flow(data="Actual Surface Flux")
# ml.plots.water_flow(data="Bottom Flux")
# ml.plots.soil_properties()

