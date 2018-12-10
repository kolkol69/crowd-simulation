# crowd-simulation
Aggregate dynamics for dense crowd simulation

# Test website
https://kolkol69.github.io/

# Start
To start simply open the .html file

# Description
As for now there is limit to 100 agents. Once you lower the limit to, for example, 60, the rest 40 (100-60=40) will become obstacles;
So you dont need to place them manually for now, and they are randomly allocated.

## Buttons
* Update - updates data without refreshing the scene; Can be used to lower the amount of moving agents or to give them new settings without repainting. The one which are not moving are now considered as obstacles; The previous agents' trajectory and speed remain the same;
* Repaint - repaints the whole scene, resets all the settings to the one which are set in the side panel; 