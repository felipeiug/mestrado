import numpy as np
import matplotlib.pyplot as plt
from matplotlib.ticker import AutoMinorLocator, MultipleLocator
from matplotlib._cm import _Set3_data
from mpltern.datasets import soil_texture_classes
from collections.abc import Iterable


def _is_iterable(var):
    return isinstance(var, (Iterable, np.ndarray)) and not isinstance(var, (str, bytes))

def _calculate_centroid(vertices):
    """Calculte the centroid of a polygon.

    https://en.wikipedia.org/wiki/Centroid#Of_a_polygon

    Parameters
    ----------
    vertices : (n, 2) np.ndarray
        Vertices of a polygon.

    Returns
    -------
    centroid : (2, ) np.ndarray
        Centroid of the polygon.
    """
    roll0 = np.roll(vertices, 0, axis=0)
    roll1 = np.roll(vertices, 1, axis=0)
    cross = np.cross(roll0, roll1)
    area = 0.5 * np.sum(cross)
    return np.sum((roll0 + roll1) * cross[:, None], axis=0) / (6.0 * area)


def plot_soil_texture_classes(
    ax:plt.Axes,
    sand:None|list[float|int]|np.ndarray=None,
    silt:None|list[float|int]|np.ndarray=None,
    clay:None|list[float|int]|np.ndarray=None,
    colors:None|list[float]=None,
    border_colors:None|list[float]=None,
    sizes:None|list[float]=None,
):
    """Plot soil texture classes."""
    classes = soil_texture_classes

    for (key, value), color in zip(classes.items(), _Set3_data):
        tn0, tn1, tn2 = np.array(value).T
        patch = ax.fill(tn0, tn1, tn2, ec="k", fc=color, alpha=0.6, zorder=2.1)
        centroid = _calculate_centroid(patch[0].get_xy())

        # last space replaced with line break
        label = key[::-1].replace(" ", "\n", 1)[::-1].capitalize()

        ax.text(
            centroid[0],
            centroid[1],
            label,
            ha="center",
            va="center",
            transform=ax.transData,
        )

    if _is_iterable(sand) and _is_iterable(clay) and _is_iterable(silt):
        ax.scatter(clay, silt, sand, zorder=3, c=colors, s=sizes, edgecolors=border_colors)

    ax.taxis.set_major_locator(MultipleLocator(10.0))
    ax.laxis.set_major_locator(MultipleLocator(10.0))
    ax.raxis.set_major_locator(MultipleLocator(10.0))

    ax.taxis.set_minor_locator(AutoMinorLocator(2))
    ax.laxis.set_minor_locator(AutoMinorLocator(2))
    ax.raxis.set_minor_locator(AutoMinorLocator(2))

    ax.grid(which="both")

    ax.set_tlabel("Clay (%)")
    ax.set_llabel("Sand (%)")
    ax.set_rlabel("Silt (%)")

    ax.taxis.set_ticks_position("tick2")
    ax.laxis.set_ticks_position("tick2")
    ax.raxis.set_ticks_position("tick2")