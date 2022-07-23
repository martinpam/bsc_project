# Project for my Bachelor's Thesis

Goal is to show people of little knowledge about computers the importance of algorithms by introducing them in a context known to everyone: sock sorting & article search in a supermarket. 
* Story Mode: Throughout several chapters, the user learns about different approaches to solving the problem. Algorithms start out very inefficient. Step by step the user gets to learn about problems faced when using the current algorithm. 
* Challenges Mode: The user can try out what they learned by solving small problems similar to those introduced in the Story Mode
* Laboratory Mode: The user can experiment with the introduced algorithms by changing parameters and creating their own simulations




  

## Setup

1. If not on your system yet, install npm ([Node Package Manager](https://nodejs.org/en/download/))
2.  Navigate into the project’s root folder and type <strong>npm install</strong> into the terminal. This downloads
all n libraries and frameworks needed to start the application
3.  type <strong> npm run serve </strong>
4.  navigate to <code> \locolhost:8080 </code> in your web browser

 ## Modifications
The following changes can be made within the <em>data.json</em> file located inside the data folder

### Dialogues

  Inside <em>data.json</em> navigate to chapters of the module you want to modify. A chapter has a an id
<em>chapterId</em> that should not be changed. Inside conversation all the parts of the conversation are
stored. Each of these objects contains four potential key-value pairs:
*  <strong>speaker</strong>: The person talking, can be set to <em>Karin, Robot</em> or <em>Narrator</em> for general story text
that should be displayed above
*  <strong>en</strong>: String of the spoken text in English
*  <strong>de</strong>: String of the spoken text in German
*  <strong>showSimulation</strong>: Optional parameter; if set, the above parameters are ignored, and instead
of showing the conversation, the simulation set as value is shown

By inserting objects of above structure, new dialogue segments can be added or simulations
started at certain points.


### Simulations
Each chapter also has a field simulations where all simulations that are to be shown within this
chapter, are stored. Each of those objects has 3-4 parameters, depending on the module:

*  <strong>name</strong>: the description, that needs to be entered as value inside the conversation under
<em>showSimulation</em> to activate it
*  <strong>algorithm</strong>: the algorithm to be used as integer
*  <strong>supermarket (supermarket only)</strong> : the store size; can be <em>SMALL, MEDIUM</em> or <em>LARGE</em>
*  <strong>shoppingList (supermarket only)</strong> : an array of item names to be searched for. All valid item
names can be found under <em>supermarketLayouts</em>
*  <strong>collection (socks only)</strong>: The sock collection to be sorted in the simulation; can be <em>SMALL,
MEDIUM, LARGE</em> or <em>HUGE</em>

Add more simulations like for example a simulation 1c if you want to show another simulation for the
supermarket story’s chapter 1. Make sure to reference to the defined name inside the conversation.

### Algorithms
Each module has a field algorithms where the lines displayed inside the code boxes can be defined.
every line has four potential properties:

*  <strong>en</strong>: text of the code line in English
*  <strong>de</strong>: text of the code line in German
*  <strong>indent</strong>: increase to add indents for a line, e.g below an If Statement
*  <strong>highlight</strong>: if set <em>true</em>, colors the text orange to signal a change compared to the previous
algorithm

Modify how the algorithms should be formulated. Adding new algorithms would however require a
change inside the code-base.

### Layouts
Under <em>supermarketLayouts</em>, the shelves of the different supermarket sizes are defined. Each shelf
has a name, which does not need to be unique since many shelves of the same type are possible.
Each shelf also has an array of items, for the <em>SMALL</em> and <em>MEDIUM</em> supermarket each shelf can
have up to three items. The <em>LARGE</em> supermarket can have up to four items per shelf. Change
how the different supermarkets have their items stored by switching the items around, however
be aware that this might influence the story’s predefined scenarios and challenges. If you instead
want to change the ordering of the shelves, this can be done inside <em>Supermarket.vue</em>, where you
would need to change the layouts set under the style tag.
New items could be added by writing the name in caps inside the shelf slot where you want it to
appear. You would also need to upload an icon to <code>\src\assets\icons\items</code> and add a translation
to <em>dictionary.js</em> similar to the already available items.

The socks module has a field <em>sockCollections where the set of socks to be sorted in <em>Story</em> and
<em>Laboratory Mode</em> can be edited. Following properties can be set:

*  <strong>color</strong>: The outer color of the sock pair; allowed colors can be found and edited inside the
colors field of the socks module
*  <strong>lineAmount</strong>: The number of horizontal lines on the socks; allowed values are <em>0</em> to <em>3</em>
*  <strong>pattern</strong>: The pattern displayed on the socks; allowed values are <em>JKU, TU, heart, dots </em>and
<em>None</em>
*  <strong>patternColor</strong>: The color of the sock pattern

If you change the socks collections, be aware it might influence the stories. The challenges however
are not affected. You can also add more sock collections, which only requires small changes
inside the <em>Algorithm.vue</em> file, where the navigation arrows switching between the collections are
hard-coded and would require you to add the newly created sock collection.

### Challenges
Challenge objects describe the parameters for the problems inside the <em>Challenges Mode</em>. Many
parameters need to be considers.

#### Both modules:
*  <strong>name</strong>: Challenge name that will appear inside the button inside the selection menu and as
title inside the challenge itself
*  <strong>algorithm</strong>: The algorithm that should be used
*  <strong>question</strong>: The question the user needs to answer before the simulation will start
*  <strong>choices</strong>: The possible answers; can be arbitrary many, but be aware of possible affects on
the layout
*  <strong>answer</strong>: String, that needs to match one of the choices
*  <strong>endMessage</strong>: The text that appears after the simulation is over, defined for both correct and
false answer

#### Supermarket module only:
*  <strong>supermarket</strong>: the store size; can be <em>SMALL, MEDIUM or LARGE</em>
*  <strong>shoppingList</strong>: an array of item names to be searched for; all valid item names can be found
under <em>supermarketLayouts
*  <strong>stopAtAnimation</strong>: the index of the animation the challenge should start from

#### Socks module only:
*  <strong>socks</strong>: An array of socks specifically defined for the challenge.
*  <strong>sockOrder</strong>: The order in which the socks should be drawn. 0 meaning a sock of the pair, that
was defined first should be drawn, 1 meaning a sock from the second pair should be drawn
and so on

Add or edit challenges freely, as there will not be any effects on the other modes.

Finding the right <em>stopAtAnimation</em> might require trying a few out, as this will always depend on how
many animations <em>Dev0</em> will need to reach a certain shelf.

Be aware that when defining the sock order for a socks challenge, you need to ensure the socks
actually end up sorted, otherwise the simulation will not work properly.