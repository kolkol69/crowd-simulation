# crowd-simulation
Aggregate dynamics for dense crowd simulation

# Test website
https://kolkol69.github.io/

# Dev repo
https://github.com/kolkol69/crowd-simulation

# Start
To start simply open the .html file

# Description
As for now there is limit to 100 agents. Once you lower the limit to, for example, 60, the rest 40 (100-60=40) will become obstacles;
So you dont need to place them manually for now, and they are randomly allocated.
To make agents look more like a crowd without grouping set Neighbour Radius smaller than Minimal Distance. 

## Buttons
* Update - updates data without refreshing the scene; Can be used to lower the amount of moving agents or to give them new settings without repainting. The one which are not moving are now considered as obstacles; The previous agents' trajectory and speed remain the same;
* Repaint - repaints the whole scene, resets all the settings to the one which are set in the side panel; 

## Settings
1. Agents - defines how many agents are present on the field. If changed with: 
    1. "Update" button, then amount of only **moving** agents is being changed.
    2. "Repaint" button, then the whole scene is being rerendered with new Agents in previously defined amount.  
2. Neighbour Radius - defines if the Agent A is considered as a _neighbour_ to B, the bigger is radius the more _neighbour_ Agents appear for Agent A.
3. Observable Degree - defines the observable degree for an Agent ("_How much does Agent see_").
4. Minimal Distance - defines the minimal distance between Agent and a Obstacle\Other Agents.
5. Weight Neighbour Velocity - defines how much the agent's _nieghbour's_ speed affects his own.
6. Weight Neighbour Distance - the less is this value the more agents will try to make groups, but also the whole system apears to be more *smooth* to the end user. Agents are not moving too fast if they try to exit their group, but it affects their chances of success. 
7. Weight Minimal Distance - is used to define agent behavior if two (or more) agents are too close to each other.
8. Weight Perturbation - perturbation is added to make Agents' moving around look more _chaotic_. If an agent is in a group with other agents, this value defines how likely he will exit it. The more the values is, the more likely he will try to escape from the froup.
9. Max Velocity - defines agents' maximum possible speed.