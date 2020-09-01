let currentID; //lets the computer know what the ID is currently on
let selectID = []; //lets the computer know what ID's are currently selected

/* USER INTERFACE FUNCTIONS HERE

 */

function searchProperties(id) { //function that does kind of a breadth first search or dfs to find the id and then returns all the properties of the id - don't know if works

    for (let i in hierarchyJson) { //goes through everything to find ID
        if (hierarchyJson[i].Id == id) { //ID is the same
            return hierarchyJson[i]; //return
        }
    }
}

function load(id) { //function to load the json

    //if just opening => go main OR COULD HAVE A SCRIPT DIRECTLY EMBEDDED 
    //if already opened => go to whatever it's going
    //make the directory go to the top and display all the children in the display

    //check by looking at what ID I'm on and displaying all ID's under it
    let properties = searchProperties(id); //where properties is the JSON of everything on that object and below
    if (properties.Type == 'Folder') {
        let w = [];
        for(let i in properties.Children){
            w[i] = searchProperties(properties.Children[i]);
        }
        let x = [], y = [], z = [];
        for (let i in w) { //properties.Children
            x[i] = w[i].Id;
            y[i] = w[i].Name;
            z[i] = w[i].Type;
        }
        document.getElementById("loadHook").innerHTML = null; //cleaning the slate of loadHook so it's clear
        for (let i in z) {
            if (z[i] == 'Folder') {
                document.getElementById("loadHook").innerHTML += "<tr>\n" +
                    "                <th><a id=\"" + x[i] + "box\" onclick=\"select(" + x[i] + ")\"><i class=\"fas fa-check-square\"></i></a></th>\n" +
                    "                <th><i class=\"fas fa-folder\"></i></th>\n" +
                    "                <th><a id=" + x[i] + " onclick=\"load(" + x[i] + ")\">" + y[i] + "</a></th>\n" +
                    "            </tr>";
            } else if (z[i] == 'Todo') {
                document.getElementById("loadHook").innerHTML += "<tr>\n" +
                    "                <th><a id=\"" + x[i] + "box\" onclick=\"select(" + x[i] + ")\"><i class=\"fas fa-check-square\"></i></a></th>\n" +
                    "                <th><i class=\"fas fa-list-ul\"></i></th>\n" +
                    "                <th><a id=" + x[i] + " onclick=\"load(" + x[i] + ")\">" + y[i] + "</a></th>\n" +
                    "            </tr>";
            } else if (z[i] == 'Note') {
                document.getElementById("loadHook").innerHTML += "<tr>\n" +
                    "                <th><a id=\"" + x[i] + "box\" onclick=\"select(" + x[i] + ")\"><i class=\"fas fa-check-square\"></i></a></th>\n" +
                    "                <th><i class=\"far fa-sticky-note\"></i></th>\n" +
                    "                <th><a id=" + x[i] + " onclick=\"load(" + x[i] + ")\">" + y[i] + "</a></th>\n" +
                    "            </tr>";
            } else {
                console.log("error could not find child type");
            }
            document.getElementById("listShow").style.display = "block";
            document.getElementById("todoShow").style.display = "none";
            document.getElementById("noteShow").style.display = "none";
        }
        currentID = id;
        //directory(id);
    } else if (properties.Type == 'Todo') { //Go to Todo Module
        loadList(id);
        document.getElementById("listShow").style.display = "none";
        document.getElementById("todoShow").style.display = "block";
        document.getElementById("noteShow").style.display = "none";
    } else if (properties.Type == 'Note') { //Go to Note Module
        document.getElementById("listShow").style.display = "none";
        document.getElementById("todoShow").style.display = "none";
        document.getElementById("noteShow").style.display = "block";
        loadNote(id);
    } else {
        console.log("load error could not find property type")
    }
    directoryPath = [];
    directory(id);
}

let directoryPath; //null directoryPath before calling it so it is cleared
function directory(id) { //recursively checks parent node until there's no more
    let property = searchProperties(id);
    directoryPath.push(property); //This line is not correct. Needs to be to make the directory where it loads onto the directoryHook
    //push because directoryPath is an array
    if (property.ParentID !== 'null') {
        directory(property.ParentID);
    } else { //it would only be else if it's null which would only be the end
        //the directory print statement
        document.getElementById("directoryHook").innerHTML = null; //cleaning the slate
        for (let i in directoryPath) {
            document.getElementById("directoryHook").innerHTML += "<a onclick=load(" + directoryPath[directoryPath.length-i-1].Id + ")>" + directoryPath[directoryPath.length-i-1].Name + "</a> > "; //gonna be like this
        }
    }
    //or could do an else statement here because it would only be else if it's null which would only be the end
    //if the path has both the first ID and 1 or if it has 1 in it, that means the path is completed. So conditional check to see if it has that?
}

function idAssign() { //always outputs 01
    let idTruth = false;
    let id;
    for (let i in hierarchyJson) {
        if (hierarchyJson[i].Id > hierarchyJson.length) { //there's missing numbers
            idTruth = true;
        }
    }
    if (idTruth == false) {
        id = hierarchyJson.length + 1;
    } else { //idTruth is false so need to find which one is missing
        let missingArray = [];
        for (let i in hierarchyJson) { //catalogue every ID so I know which numbers are null
            missingArray[hierarchyJson[i].Id - 1] = hierarchyJson[i].Id;
        }
        console.log(missingArray);
        for (let i in hierarchyJson) { //goes through the catalogue to find nulls and first null becomes id
            if (missingArray[i] == null) {
                id = i + 1;
                break;
            }
        }
    }
    return id;
}

function AddFile(parentID, type) { //when user presses add file button

    //document.getElementById("demo").innerHTML = document.getElementById("demo").innerHTML.concat("hello") ;
    let fileJSON = {
        "Id": idAssign(),
        "Name": "Untitled",
        "Type": type,
        "ParentID": parentID, //something here
        "Children": [] //empty array for now
    };
    hierarchyJson.push(fileJSON);
    hierarchyJson[parentID-1].Children.push(fileJSON.Id); //put the child ID in the parent child area
    //console.log(hierarchyJson[parentID].Children);
    load(fileJSON.ParentID);
    selectID.push(fileJSON.Id);
    Rename();
    selectID = []; //so selectId doesn't get the new file deleted
}

function Rename() { //when user presses rename button
    for (let i in selectID) { //goes through each selected item
        let properties = searchProperties(selectID[i]); //grabs id properties
        document.getElementById(selectID[i]).removeAttribute("onclick"); //nulls the onclick so it doesn't load the file when clicked on
        document.getElementById(selectID[i]).innerHTML = "<input class=\"input\" maxlength=\"20\" style=\"width:20em;\" type=\"text\" id=\"" + selectID[i] + "text\" value=" + properties.Name + "> <button class=\"button\" type=\"button\" " +
            "onclick=\"save(" + selectID[i] + ")\">Finish</button>"; //makes them selectable here
        //<a id=x[i] onclick="load(x[i])"> y[i] </a>
    }
}

function save(id) {
    let value = document.getElementById(id + "text").value;
    document.getElementById(id).innerHTML = value; //changes the value on the front end
    document.getElementById(id).onclick = 'load(' + id + ')';
    for (let i in hierarchyJson) { //loop to go through every object to change value on back-end
        if (id == hierarchyJson[i].Id) {
            hierarchyJson[i].Name = value;
            break;
        }
    }
    let properties = searchProperties(id);
    load(properties.ParentID);
}

function Remove() { //when user presses remove button
    for (let i in selectID) { //goes through each selected item
        let removeID = selectID[i];
        let spliced;

        for (let j in hierarchyJson) {//finds the Json
            if (hierarchyJson[j].Id == removeID) {
                spliced = hierarchyJson.splice(j, 1); //removes the object
                break;
            }
        }
        for(let j in hierarchyJson){
            if(spliced[0].ParentID == hierarchyJson[j].Id){
                for(let k in hierarchyJson[j].Children){
                    if(hierarchyJson[j].Children[k] == removeID){
                        let deleted = hierarchyJson[j].Children.splice(k, 1);
                        break;
                    }
                }
                break;
            }
        }
        if (spliced[0].Type == "Folder") {
            if (spliced[0].Children != null) { //that means there's children
                let tempSelectID = selectID; //temporary storage so I don't lose original selected while I delete the children
                for (let j in spliced[0].Children) {
                    selectID = []
                    selectID.push(spliced[0].Children[j]);
                    Remove();
                }
                selectID = tempSelectID;
            }
        } else if (spliced[0].Type == "Todo") { //deletes in todojson as well
            for (let j in todoJson) {//finds the Json
                if (todoJson[j].Id = removeID) {
                    let deleted = todoJson.splice(j, 1); //removes the object
                    break;
                }
            }
        } else if (spliced[0].Type == "Note") { //deletes in noteJson as well
            for (let j in noteJson) {//finds the Json
                if (noteJson[j].Id = removeID) {
                    let deleted = noteJson.splice(j, 1); //removes the object
                    break;
                }
            }
        } else {
            console.log("error removing")
        }
    }
    selectID = [];
    load(currentID);
} //need to change this for the for folder, todolist, note

function rePositionFile() { //change the ParentID and Parent's ChildID - ADD LAST
    //after moving, make sure children are the same and parent. If not, move
}

function select(id) { //when user presses select, goes here
    let idAdd = true;
    console.log(selectID);
    for (let i in selectID) { //goes through the select ID to see whether to select or unselect
        if (selectID[i] == id) { //therefore already selected
            selectID.splice(i, 1); //unselect it
            idAdd = false;
            document.getElementById(id+'box').style = "blue";
            break;
        }
    }
    if (idAdd == true) { //means it's unselected so select it
        selectID.push(id);
        document.getElementById(id+'box').style.color = "black";
    }
}

/*TODO FUNCTIONS HERE

 */
function loadList(id){ //function to load the to do list
    for(let i in todoJson){ //goes through all the objects in todoJson
        if(id == todoJson[i].Id){ //when at the object
            document.getElementById("toDoHook").innerHTML = null;
            for(let j in todoJson[i].Items){ //go through all the lists item and prints them
                let itemValue = todoJson[i].Items[j].Value;
                document.getElementById("toDoHook").innerHTML += "<tr><th><div onclick=\"complete(" + itemValue + ")\" class=\"button\"><i class=\"fas fa-check-square\">" +
                    "</i></div><div onclick=\"editItem(" + itemValue + ")\" class=\"button\"><i class=\"fas fa-edit\"></i></div><div onclick=\"removeItem(" + itemValue + ")\" class=\"button\">" +
                    "<i class=\"fas fa-trash-alt\"></i></div></th><th id=" + itemValue + ">" + itemValue + "</th><th>" + isCompleted(todoJson[i].Items[j].Completed) + "</th><th></th></tr>";
            }
        }
    }
    currentID = id;
    //onclick complete is value

}
function isCompleted(value) {
    if(value == true){
        return "Yes";

    }else{
        return "No";
    }
}
function addItem(){ //function to add items into the todo list
    let fileJSON = {
        "Value":"Untitled",
        "Completed": false
    };
    for(let i in todoJson){ //goes through all the objects in todoJson
        if(currentID == todoJson[i].Id){ //when at the object
            todoJson[i].Items.push(fileJSON);
            break;
        }
    }
    //loadList(currentID);
    editItem(fileJSON.Value);
}
function removeItem(value){ //function to remove items into the todo list
    console.log(value);
    let realValue = value.id;
    for(let i in todoJson){
        if(currentID == todoJson[i].Id){
            for(let j in todoJson[i].Items){ //loop to go through every object to change value on back-end
                if(todoJson[i].Items[j].Value == realValue) {
                    todoJson[i].Items.splice(j, 1);
                    break;
                }
            }
            break;
        }
    }
    console.log("done");
    loadList(currentID);
}

function editItem(value){
    let realValue;
    console.log(value);
    if(value.id != null){
        console.log("there");
        realValue = value.id;
    }
    else{
        console.log("here");
        realValue = value;
    }
    for(let i in todoJson){
        if(currentID == todoJson[i].Id){
            document.getElementById(realValue).innerHTML = "<input class=\"input\" maxlength=\"20\" style=\"width:20em;\" type=\"text\" id=\"" + realValue + "text\" value=\"" + realValue + "\">" +
                "<button class=\"button\" type=\"button\" onclick=\"saveItem(" + realValue + ")\">Finish</button>";
            break;
        }
    }
}
function saveItem(value) {
    let realValue = value.id;
    //let realValue = value.slice(0, -4); //slices the last 4 out which would be text to get the real ID
    let actualValue = document.getElementById(realValue + "text").value;
    document.getElementById(realValue).innerHTML = actualValue; //changes the value on the front end
    for(let i in todoJson){
        if(currentID == todoJson[i].Id){
            for(let j in todoJson[i].Items){ //loop to go through every object to change value on back-end
                if(todoJson[i].Items[j].Value == realValue){
                    todoJson[i].Items[j].Value = actualValue;
                    break;
                }
            }
            break;
        }
    }
    loadList(currentID);
}
function complete(value){
    for(let i in todoJson){
        if(currentID == todoJson[i].Id){
            for(let j in todoJson[i].Items){ //loop to go through every object to change value on back-end
                if(todoJson[i].Items[j].Value == value.id) {
                    if (todoJson[i].Items[j].Completed == true) { //if it's been completed
                        todoJson[i].Items[j].Completed = false; //uncomplete it
                    } else {
                        todoJson[i].Items[j].Completed = true; //since not completed, complete it
                    }
                    break;
                }
            }
            break;
        }
    }
    loadList(currentID);
}


/* NOTE FUNCTIONS HERE

 */
function loadNote(id){
    for(let i in noteJson){
        if(id == noteJson[i].Id){
            document.getElementById("noteHook").innerHTML = null;
            document.getElementById('noteHook').innerHTML = "<h1 class=\"is-size-4\"><strong>" + noteJson[i].Name + "" +
                "</strong><button onclick=\"saveNote(" + id + ")\" class=\"button is-pulled-right\"><i class=\"fas fa-save\"></i></button></h1>" +
                "<textarea class=\"textarea\" rows=\"25\" id=" + id + ".value" + ">" + noteJson[i].Value + "</textarea>";
        }
    }
}

function saveNote(id){ //Need to save over multiple instances
    for(let i in noteJson){
        if(id == noteJson[i].Id){ //id validation
            noteJson[i].Value = document.getElementById(id + ".value").value;
            break;
        }
    }
}

/*JSON VARIABLES HERE

 */
let hierarchyJson = [];
hierarchyJson[0] = {"Id": 1,
    "Name": "Main",
    "Type": "Folder",
    "ParentID": "null",
    "Children": [2,3,4]};
hierarchyJson[1] = {"Id": 2,
    "Name": "Groceries",
    "Type": "Folder",
    "ParentID": "1",
    "Children": [5,6]};
hierarchyJson[2] ={
    "Id": 5,
    "Name": "Vegetables",
    "Type": "Todo",
    "ParentID": "2"
};
hierarchyJson[3] ={
    "Id": 6,
    "Name": "Photos",
    "Type": "Folder",
    "ParentID": "2",
    "Children":[7]
};
hierarchyJson[4] = {
    "Id": 3,
    "Name": "Shopping Saturday",
    "Type": "Todo",
    "ParentID": "1"
};
hierarchyJson[5] = {
    "Id": 4,
    "Name": "Chapter One",
    "Type": "Note",
    "ParentID": "1"
};
hierarchyJson[6] = {
    "Id": 7,
    "Name": "Photos2",
    "Type": "Note",
    "ParentID": "6"
}

let todoJson = [];
todoJson[0] = {"Id": 3,
    "Name": "Shopping Saturday",
    "Items":[
        {
            "Value":"Shoes",
            "Completed": false
        }, {
            "Value":"Clothes",
            "Completed": true
        }, {
            "Value":"Movies",
            "Completed": false
        }
    ]};
todoJson[1] = {
    "Id": 5,
    "Name": "Vegetables",
    "Items":[
        {
            "Value":"Oranges",
            "Completed": true
        }, {
            "Value":"Clementines",
            "Completed": true
        }, {
            "Value":"Bananas",
            "Completed": false
        }
    ]
};
let noteJson = [];
noteJson[0]={
    "Id": 4,
    "Name": "Chapter One",
    "Value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in oluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
};
noteJson[1]={
    "Id": 7,
    "Name": "Photos2",
    "Value": "HELLO"
};

//TODO: MAKE THE LIST SAVE TO SERVERSIDE
//TODO: MAKE RESPONSIVE WITH MOBILE
//TODO: FIX BUGS ON THE TODOLIST