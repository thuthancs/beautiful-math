from calendar import c
import matplotlib.pyplot as plt
import math
from tqdm.auto import tqdm

def draw_branch(x1, y1, 
                length, 
                angle, 
                a, 
                ax,
                threshold,
                fraction,
                depth,
                max_depth):
    # Stop when the segment is too small or recursion is too deep
    if length < threshold or depth >= max_depth:
        return
    
    # Calculate the end point of the branch
    x2 = x1 + length * math.cos(math.radians(angle))
    y2 = y1 + length * math.sin(math.radians(angle))
    
    # Draw the branch
    ax.plot([x1, x2], [y1, y2], color='green')
    
    # Calculate the point along the branch where children start
    # (fraction of the way from (x1, y1) to (x2, y2))
    mx = x1 + (x2 - x1) * fraction
    my = y1 + (y2 - y1) * fraction
    
    # Length of child branches
    child_len = length * fraction
    if child_len < threshold:
        return
    
    # Recursively draw the left and right branches from the midpoint
    draw_branch(mx, my, child_len, angle + a, a, ax, threshold, fraction, depth + 1, max_depth)
    draw_branch(mx, my, child_len, angle - a, a, ax, threshold, fraction, depth + 1, max_depth)
    draw_branch(mx, my, child_len, angle, a, ax, threshold, fraction, depth + 1, max_depth)

def draw_tree_on_ax(ax, l, a, threshold=2, fraction=0.5, max_depth=8):
    x1, y1 = 0, 0
    angle = 90
    x2 = x1 + l * math.cos(math.radians(angle))
    y2 = y1 + l * math.sin(math.radians(angle))
    ax.plot([x1, x2], [y1, y2], color='green')
    
    # Point along the trunk where child branches start
    mx = x1 + (x2 - x1) * fraction
    my = y1 + (y2 - y1) * fraction
    
    child_len = l * fraction
    if child_len >= threshold:
        draw_branch(mx, my, child_len, angle + a, a, ax, threshold, fraction, 1, max_depth)
        draw_branch(mx, my, child_len, angle - a, a, ax, threshold, fraction, 1, max_depth)
        draw_branch(mx, my, child_len, angle, a, ax, threshold, fraction, 1, max_depth)
    
    ax.set_aspect('equal')
    ax.axis('off')


def draw_tree(l, a, threshold=2, fraction=0.5, max_depth=8):
    """Helper function to draw a single tree in its own figure."""
    fig, ax = plt.subplots()
    draw_tree_on_ax(ax, l, a, threshold=threshold, fraction=fraction, max_depth=max_depth)
    plt.show()

if __name__ == "__main__":
    # Create a 3x3 grid of subplots with different tree configurations
    fig, axes = plt.subplots(3, 3, figsize=(9, 9))

    angles = [15, 30, 45]
    fractions = [0.5, 0.6, 0.7]

    # Iterate over all 9 subplot positions with a progress bar
    configs = [(i, j) for i in range(3) for j in range(3)]

    for i, j in tqdm(configs, desc="Drawing trees"):
        ax = axes[i, j]
        a = angles[j]
        fraction = fractions[i]
        draw_tree_on_ax(
            ax,
            l=30,
            a=a,
            threshold=0.5,
            fraction=fraction,
            max_depth=10,
        )

    plt.tight_layout()
    plt.show()