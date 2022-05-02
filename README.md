# Project for my Bachelor's Thesis
Goal is to show people of little knowledge about computers the importance of algorithms

## How to use
After the project setup, run 'npm run serve' then go to localhost:8080

choose a module (currently only supermarket is implemented) and then choose between 3 modes

### Story Mode:
dialog between Karin and Dev0, split into chapters , where in each chapter a new algorithm is introduced and run in a simulation

user can go through the whole story in one go or enter the chapter number in the path (e.g '/supermarket/chapters/3')

### Algorithm Mode:
The same simulations as in the story, but without the dialog around it -> useful for presenting in class

### Laboratory:
Users can combine algorithm type, size of supermarket, shopping list themselves


not yet working: algorithm 5

## How to change parameters

Data is stored in the data.json file, where many adaptions can be made without touching any code:

modules/supermarket/chapters/simulations: Add simulations that are to be shown in the specific chapter
simulations require 4 parameters
name as string
algorithm: the number of the algorithm to be used (1-5)
supermarket: size of the supermarket to be used (small, medium, large)
shoppingList: array of item names, that are to be searched for in the simulation

modules/supermarket/chapters/conversation: Change who says what in which order, add "showShimulation" with the simulation id to let the simulation show up at that specific time in the dialog

modules/supermarket/algorithms: Add or change the code lines that are displayed during a simulation. Can add "indent" parameter to add padding on the left. can add "highlight" : true   to make the code line text color orange

modules/supermarket/supermarketLayouts: items (and their location) can be changed for the different supermarkets. Small and medium supermarket have 3 items per corridor, large supermarket has 4

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
