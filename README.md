# screeps

For what it's worth, I hate everything about the code in this repo.

![don't touch my garbage!!!!](assets/no_touch.png)

### Grunt Setup
Follow This: https://docs.screeps.com/contributed/advanced_grunt.html
```
# cp .screeps.json.example .screeps.json
### Make changes to .screeps.json ##
# npm install
# grunt
```

### General Idea
***Room***: Maintains (in memory) a collection of work that needs to be performed.

***Builder***: Randomly selects a task from the list, then proceeds to work the task until the task is no longer advertised by the room.

### Known....Features....
- **Intended:** If one harvester dies a builder converts to a harvester and a new builder is built.
  **Actual:** If one harvester dies ALL the builders convert into harvesters, then another harvester is built, and then, finally, some builders are built.