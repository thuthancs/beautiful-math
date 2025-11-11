from math import sin, cos, pi
import matplotlib.pyplot as plt

# Adapted from The Beauty of Fractals Six Different Views (Chapter 1 - Mathscapes - Fractal Scenery) by Anne M. Burns
# Global list to store line segments for visualization
lines = []

def plant(n, theta, x, y, l):
    if n == 0:
        # draw a line segment at (x, y), at angle theta with the horizontal and with length l
        x2 = x + l * cos(theta)
        y2 = y + l * sin(theta)
        lines.append((x, y, x2, y2))
    else:
        l = l/3
        # 1. First trunk segment
        plant(n-1, theta, x, y, l)
        # 2. Update position
        x = x + l * cos(theta)
        y = y + l * sin(theta)
        
        # 3. Branch left (from same point as next segment)
        plant(n-1, theta + pi/3, x, y, l)
        
        # 4. Second trunk segment (from same point as left branch)
        plant(n-1, theta, x, y, l)
        
        # 5. Update position
        x = x + l * cos(theta)
        y = y + l * sin(theta)
        
        # 6. Branch right (from same point as next segment)
        plant(n-1, theta - pi/3, x, y, l)
        
        # 7. Third trunk segment (from same point as right branch)
        plant(n-1, theta, x, y, l)

def visualize(n=3, theta=0, x=0, y=0, l=1):
    """Visualize the fractal tree"""
    global lines
    lines = []  # Reset lines list
    
    # Generate the fractal
    plant(n, theta, x, y, l)
    
    # Create the plot
    fig, ax = plt.subplots()
    
    # Draw all line segments
    for x1, y1, x2, y2 in lines:
        ax.plot([x1, x2], [y1, y2], 'b-', linewidth=0.5)
    
    # Set equal aspect ratio and adjust limits
    ax.set_aspect('equal')
    ax.axis('off')
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    visualize(n=5, theta=pi/2, x=1, y=2, l=1)