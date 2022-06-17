//Declare Necessary Variables
let array1 = []; //Data
let array2 = []; //Goal
let array3 = []; //Resource
let nmbToShow = "All"; //For Data Slide
let nmbToShow2 = "All"; //For Goal Slide
let max_nmbToShow = 8;
let max_nmbToShow2 = 6;
let showImg = false;
let empty = `<text>?</text>`;
let t0, t1; //Check Load Game Time
let adjustment = 0, adjustment2 = 0;

//game set up variables
let level = 1;
let moves; // set up in createGame(obj)
let playMusic;
let mute = false;
let win = false;
let currentMode = `demonSlayer`;
let viewInside = false; //View curtain variable\

//Timer variables
let TIME_LIMIT = 5; //seconds
let timePassed = 0;
let timeLeft = timeLimit();
const COLOR_CODES = {
    info: {color: "green"},
    warning: {
        color: "orange",
        threshold: timeLimit()*0.6
    },
    alert: {
        color: "red",
        threshold: timeLimit()*0.3
    }
};
let remainingPathColor = COLOR_CODES.info.color;

//mementos
const mementos = []; // Undo
const mementos2 = []; // Redo
const mementos3 = []; // adjustment
const mementos4 = []; // random moves [solve]
const mementos5 = []; // random moves [list out from 1st move to last moves]
const mode_mementos = []; //game mode - generateData(obj)

//intervals
let hintInterval = null;
let timerInterval = null;
let solveInterval = null;

//runnings
let adjustRunning = false;
let copyAlertRunning = false;
let solveRunning = false;
let generateDataRunning = false;
let loaderRunning = false;

//audio
let audio_timer = new Audio('mp3/timer.mp3');
let audio_homura = new Audio('mp3/homura_Lisa.mp3');
let audio_replace = new Audio('mp3/shortSound003_metalSpring.mp3');
let audio_remove = new Audio('mp3/shortSoundEffect004_remove.mp3');
let audio_insert = new Audio('mp3/shortSoundEffect005.mp3');
let audio_copy = new Audio('mp3/shortSoundEffect006.mp3');
let audio_startGame = new Audio('mp3/piano_soundEffect.mp3');
let audio_noMoreMoves = new Audio('mp3/shortSound002_cute2.mp3');
let audio_win = new Audio('mp3/shortSoundEffect007_win.mp3');
audio_insert.volume = 0.1;
audio_remove.volume = 1;
audio_replace.volume = 0.1;
audio_timer.volume = 0.3;
audio_copy.volume = 0.1;
audio_noMoreMoves.volume = 0.2;
audio_win.volume = 0.1;
audio_startGame.volume = 0.2;
audio_homura.volume = 0.2;

//set up JSON data
var anime = 
{
    "demonSlayer":[
      {"firstName":"Tanjiro", "lastName":"Kamado"},
      {"firstName":"Nezuko", "lastName":"Kamado"},
      {"firstName":"Zenitsu", "lastName":"Agatsuma"},
      {"firstName":"Inosuke", "lastName":"Hashibira"},
      {"firstName":"Kanao", "lastName":"Tsuyuri"}
    ]
};
//Run on load (create DD only, for better appearance)
function onLoad(){
    //create DD first if not the remove() in generateData() will delete nothing
    createDD();
}
//set number of data to show
function nmbDataToShow(nmb, noMax){ //For Data Slide
    if(nmb != null){nmbToShow = nmb;}
    if(nmb == "All" || nmbToShow == "All"){nmbToShow = array1.length;}
    if(noMax != true && nmbToShow > max_nmbToShow){nmbToShow = max_nmbToShow;} 
    recreateDataSlide();
    adjustment = 0; //for adjust image
    //Apply Back Hint
    var previousAction = mementos3.pop();
    if(previousAction == `insertHint`){insertHint();}
    if(previousAction == `removeHint`){removeHint();}
    if(previousAction == `replaceHint`){replaceHint();}
    //display nmbToShow
    document.getElementById(`inputNmb`).innerHTML = nmbToShow;
    if(nmb == "All"){nmbToShow = "All";}
}
function nmbDataToShow2(nmb, noMax){ //For Goal Slide
    if(nmb != null){nmbToShow2 = nmb;}
    if(nmb == "All" || nmbToShow2 == "All"){nmbToShow2 = array2.length;}
    if(noMax != true && nmbToShow2 > max_nmbToShow2){nmbToShow2 = max_nmbToShow2;}
    recreateGoalSlide();
    adjustment2 = 0; //for adjust image
    //display nmbToShow
    document.getElementById(`inputNmb2`).innerHTML = nmbToShow2;
    if(nmb == "All"){nmbToShow2 = "All";}
}
function autoSubmit(this_id){
    var input = document.getElementById(`${this_id}`).value;
    if(this_id == `inputNmb`){
        nmbDataToShow(input);
    } else nmbDataToShow2(input);
}
function upDown(adjust){ //For Data Slide
    var input = parseInt(document.getElementById(`inputNmb`).innerHTML);
    if(input <= 1 && adjust < 0){return false;}
    if(input == array1.length && adjust > 0){return false;}
    if(input == 8 && adjust > 0){return false;}
    input += adjust;
    nmbDataToShow(input);
}
function upDown2(adjust){ //For Goal Slide
    var input = parseInt(document.getElementById(`inputNmb2`).innerHTML);
    if(input <= 1 && adjust < 0){return false;}
    if(input == array2.length && adjust > 0){return false;}
    if(input == 6 && adjust > 0){return false;}
    input += adjust;
    nmbDataToShow2(input);
}
//Create Sliders
function createArray(_array, carousel_id, carousel_cls, carousel_inner, previousNext, carousel_indicators){ //Data
    //choose to create Array 1 or Array 2
    let show = nmbToShow, arrLength = array1.length;
    if(_array == `array2`){show = nmbToShow2; arrLength = array2.length;}
    if(show == "All"){show = arrLength;}
    //Create slider for _array
    for(var i = 0; i < show; i++){
        if(i == arrLength){break;};
        //myCarousel div
        var div3 = document.createElement("div"),id = document.createAttribute("id"),dataInterval = document.createAttribute("data-interval");
        id.value = `${carousel_id}${i+1}`;
        dataInterval.value = `false`;
        div3.setAttributeNode(id);
        div3.className = `${carousel_cls} carousel slide`;
        div3.setAttributeNode(dataInterval);
        div3.style.cssText = `width: 100px; height: 100px; border: 5px solid black; border-radius: 20%; margin: 10px; display: inline-block; font-weight: bold; line-height: 90px;`
        //Carousel Inner div
        var div2 = document.createElement("div"),id = document.createAttribute("id"),role = document.createAttribute("role");
        id.value = `${carousel_inner}${i+1}`;
        role.value = `listbox`;
        div2.setAttributeNode(id);
        div2.className = `carousel-inner`;
        div2.setAttributeNode(role);
        //Carousel Indicator Div
        var divIndicators = document.createElement("div"),id = document.createAttribute("id");
        id.value = `${carousel_indicators}${i+1}`;
        divIndicators.setAttributeNode(id);
        var ol = document.createElement("ol"),cls = document.createAttribute("class");
        cls.value = `carousel-indicators`;
        ol.setAttributeNode(cls);
        //Start create inner content, Divs append their child
        for (var j = 0; j < arrLength; j++){
            //create div Item
            var div1 = document.createElement("div");
            if(i==j && j == j){div1.className = `item active`;} else div1.className = `item`;
            //create div array data
            var divArrayData = document.createElement("div"),id = document.createAttribute("id");
            id.value =`${carousel_inner}${i+1}&${j}`;
            divArrayData.setAttributeNode(id);
            divArrayData.className = `data`;
            //show data
            let arrayData1;
            if(_array == `array1`){arrayData1 = array1[j];} else arrayData1 = array2[j];
            divArrayData.innerHTML = arrayData1;
            //div1 Items append Data
            div1.appendChild(divArrayData);
            div2.appendChild(div1);
            div3.appendChild(div2);
            //if need to show image then only create
            if(showImg == true){
                //create div images
                var divImg = document.createElement("div");
                divImg.className = `overlay`;
                //create img
                var img = document.createElement("img"),id = document.createAttribute("id"),src = document.createAttribute("src");
                img.style.cssText = `width: 100%; height: 101%; border-radius: 17%;`
                id.value =`${carousel_inner}${i+1}&${j}img`;
                src.value = ``;
                let arrayData2;
                if(_array == `array1`){arrayData2 = array1[i];} else arrayData2 = array2[i];
                for(k = 0; k < 5; k++){
                    if(arrayData2 == ImagePath(k)){
                        src.value = `img/${currentMode}/${ImagePath(k)}.jpg`;
                        break;
                    }
                }
                //div1 Items append div Img
                img.setAttributeNode(id);
                img.setAttributeNode(src);
                divImg.appendChild(img);
                div1.appendChild(divImg);
                //add hover effect to div2 - carousel-inner
                var css = document.createTextNode(`#${carousel_inner}${i+1}:hover .overlay{opacity: 0;}`);
                var head = document.getElementsByTagName('head'), style = document.createElement('style');
                style.appendChild(css);
                head[0].appendChild(style);
                }
            //Carousel Indicator appends Indicators (li)
            var li = document.createElement("li"), dataTarget = document.createAttribute("data-target"), dataSlideTo = document.createAttribute("data-slide-to"), cls = document.createAttribute("class");
            dataTarget.value = `${carousel_id}${i+1}`;
            dataSlideTo.value = `${j}`;
            if(i==j && j == j){cls.value = `active`;} else cls.value = ``;
            li.setAttributeNode(dataTarget);
            li.setAttributeNode(dataSlideTo);
            li.setAttributeNode(cls);
            ol.appendChild(li);
            divIndicators.appendChild(ol);
            div3.appendChild(divIndicators);
            document.getElementById(`${_array}`).appendChild(div3);
        }
    }
    //Show or Hide Previous and Next
    if(arrLength <= show){
        document.getElementById(`${previousNext}`).style.display = `none`;
        for(var i = 0; i < arrLength; i++){
            document.getElementById(`${carousel_indicators}${i+1}`).style.display = `none`;
        }
    }
    else {
        document.getElementById(`${previousNext}`).style.display = `block`
    };
}
function removeArray(_array, previousNext){
    var array = document.getElementById(`${_array}`);
    while(array.lastChild.id !== `${previousNext}`){
        array.removeChild(array.lastChild);
    }
}
function recreateGoalSlide(){
    removeArray(`array2`, `previousNext2`); //Goal
    createArray(`array2`, `myCarouselY`, `myCarousel2`, `carousel-innerY`, `previousNext2`, `carousel-indicatorsY`);
    clearDuplicateStyle();
}
function recreateDataSlide(){
    removeArray(`array1`, `previousNext`); //Data
    createArray(`array1`, `myCarousel`, `myCarousel`, `carousel-inner`, `previousNext`, `carousel-indicators`);
    clearDuplicateStyle();
    if(mementos4.length == 0){ //Stop Solve
        clearInterval(solveInterval);
        solveRunning = false;
        setTimeout(() => {winCheck();}, 0);
    }
}
//reset inputs, selected data, adjustment and Clean
function recreateInputsAndDD(){
    //Reset
    clearInterval(hintInterval);
    document.getElementById("queueNmb").remove();
    document.getElementById("queueNmb2").remove();
    document.getElementById("queueNmb2_2").remove();
    document.getElementById("rngNmb").remove();
    document.getElementById("selectedDataValue").innerHTML = empty;
    var selectedDataImg = document.getElementById("selectedDataImg");
    if(selectedDataImg != null){selectedDataImg.remove();}
    document.getElementById("nmbOfInsert").value = "1";
    document.getElementById("multipleBox").style.display = `none`;
    document.getElementById("singleBox").style.display = `inline`;
    //Refresh
    createDD();
    displayUndoRedoMoves();
}
function displayUndoRedoMoves(){
    document.getElementById("moves").innerHTML = `${moves}`;
    document.getElementById("undoCount").innerHTML = mementos.length;
    document.getElementById("redoCount").innerHTML = mementos2.length;
}
function clearDuplicateStyle(){//remove extra duplicated style
    var styleLength = document.getElementsByTagName('style').length;
    for(var i = 0; i < styleLength - 1;i++){
        styleLength = document.getElementsByTagName('style').length;
        for(var j = styleLength - 1;j > 0; j--){  
            if(i == j){break;} //if i == j, they are same item
            var itemI = document.getElementsByTagName('style').item(i); //fromTopChild
            var itemJ = document.getElementsByTagName('style').item(j); //fromBottomChild
            if(itemI == null || undefined){break;}
            if(itemI.innerText == itemJ.innerText){itemJ.remove();}
        }
    }
}
//Dropdown(s)
function generateDD(nmb,dd){
    var select = document.createElement("select"),att = document.createAttribute("id");
    att.value = nmb;
    select.setAttributeNode(att); 
    var arrLength = array1.length, dropdown = document.getElementById(dd);
    dropdown.insertBefore(select,dropdown.childNodes[0]);
        //generate DD
        if(nmb == "queueNmb"){
            arrLength += 1;
            for (var i = 0; i < arrLength; i++){
                var option = document.createElement("option");
                select.appendChild(option); 
                var att2 = document.createAttribute("value");
                att2.value = i + 1;
                option.setAttributeNode(att2);
                option.innerHTML = i + 1;
            }
        }
        if(nmb == "rngNmb"){
            var queueNmb2 = parseInt(document.getElementById("queueNmb2").value);
            var arrLength = arrLength - queueNmb2 + 1;
            for (var i = 0; i < arrLength; i++){
                var option = document.createElement("option");
                var att2 = document.createAttribute("value");
                var id = document.createAttribute("id");
                att2.value = i + 1;
                id.value = i + queueNmb2;
                select.appendChild(option); 
                option.setAttributeNode(att2);
                option.setAttributeNode(id);
                option.innerHTML =array1[i + queueNmb2 - 1];
                }
        }
        if(nmb == "queueNmb2" || nmb == "queueNmb2_2"){
            for (var i = 0; i < arrLength; i++){
                var option = document.createElement("option");
                select.appendChild(option); 
                var att2 = document.createAttribute("value");
                att2.value = i + 1;
                option.setAttributeNode(att2);
                option.innerHTML =array1[i];
            }
        }
}
function createDD(){
    generateDD("queueNmb","dropdown1");
    generateDD("queueNmb2","dropdown2");
    generateDD("queueNmb2_2","dropdown2_2");
    generateDD("rngNmb","dropdown3");
}
function autoUpdateD3(){ //Auto Update D3 base on D2
    var rngNmb = document.getElementById("rngNmb");
    //get selected data before auto update dropdown 3
    var prevSelected = rngNmb.options[rngNmb.selectedIndex].id;
    //update dropdown 3
    rngNmb.remove();
    generateDD("rngNmb","dropdown3");
    //after autoUpdateD3, select previous selected
    var rngNmb = document.getElementById("rngNmb");
    var currentSelected = rngNmb.options[rngNmb.selectedIndex].id;
        for(var i = 1; currentSelected != prevSelected;i++){
            //if current selected != previous selected, check next option
            rngNmb.value = `${i}`;
            var currentSelected = rngNmb.options[rngNmb.selectedIndex].id;
            //if current selected found, then stop
            if(currentSelected == prevSelected){return false;}
            //if not found, then select the first option
            if(i == rngNmb.length){
                rngNmb.value = `${1}`;
                return false;
            }
        }
}
//Resource
function createResource(){
    document.getElementById(`resources`).className = `disappear`;
    //create resources
    var resources_ul = document.getElementById(`resources_ul`);
    for(i = 0; i < array3.length; i++){
        var li = document.createElement("li"),id = document.createAttribute("id");
        id.value = `resource${i+1}`;
        li.setAttributeNode(id);
        li.style.cssText = `width: 50px; height: 50px; border: 2.5px solid black; border-radius: 20%; margin: 5px; display: inline-block; font-size: 10px; font-weight: bold; line-height: 45px; position: relative;`
        //add onClick effect to array Data
        li.addEventListener("click", function(){copyText(this.id)});
        li.innerHTML = array3[i];
        resources_ul.appendChild(li);
        //if need to show image then only create
        if(showImg == true){
            //create div images
            var divImg = document.createElement("div");
            divImg.className = `overlay`;
            //create img
            var img = document.createElement("img"),id = document.createAttribute("id"),src = document.createAttribute("src");
            img.style.cssText = `width: 100%; height: 101%; border-radius: 17%;`
            id.value =`resource${i+1}img`;
            src.value = ``;
            for(k = 0; k < 5; k++){
                if(array3[i] == ImagePath(k)){
                    src.value = `img/${currentMode}/${ImagePath(k)}.jpg`;
                    break;
                }
            }
            img.setAttributeNode(id);
            img.setAttributeNode(src);
            divImg.appendChild(img);
            li.appendChild(divImg);
            //add hover effect to resource
            var css = document.createTextNode(`#resource${i+1}:hover .overlay{opacity: 0;}`);
            var head = document.getElementsByTagName('head'), style = document.createElement('style');
            style.appendChild(css);
            head[0].appendChild(style);
            }
    }
}
function removeResource(){
    var resources_ul = document.getElementById("resources_ul");
    while(resources_ul.lastChild.id !== `hr`){resources_ul.removeChild(resources_ul.lastChild);}
}
function recreateResources(){
    removeResource();
    createResource();
    clearDuplicateStyle();
}
//Features [Action]
function insertData(set, input, nmbOfInsert, queueNmb){
    if(document.getElementById(`startScreen_checkBox`).checked != true){return false;}
    if(adjustRunning == true){return false;}
    if(set == `randomMove`){
        //auto solve Message
       if(nmbOfInsert == 1){mementos5.push(`<big>Move: </big>Insert<br><big>Data:</big>${nmbOfInsert} x <br>${input}`);}
       else {mementos5.push(`<big>Move: </big>Insert<br><big>Data: </big>${nmbOfInsert} x <br>${input}`);}
       //insert data
       for(var i = 0; i < nmbOfInsert;i++){array2.unshift(input);}
       var moveData = array2.splice(nmbOfInsert,queueNmb-1);
       for(var i = moveData.length; i > 0 ; i--){array2.unshift(moveData.pop());}
       mementos4.push([...array2]);
       return false;          
   }
    checkMoves();
    if(moves == 0){return false;}
        //Get input data
        input = document.getElementById("selectedDataValue").innerHTML;
        if (input ==  empty){alert(`Select item from "Click Me!" menu`);return false;}
        //single or multiple
        queueNmb = parseInt(document.getElementById("queueNmb").value);
        nmbOfInsert = parseInt(document.getElementById("nmbOfInsert").value);
        if(document.getElementById("single").checked){nmbOfInsert = 1;}
        //change, control, display nmbToShow
        var all = nmbToShow;
        if(all == "All"|| all < array1.length + nmbOfInsert){nmbToShow = array1.length + nmbOfInsert;}
        if(nmbToShow > max_nmbToShow){nmbToShow = max_nmbToShow;}
        document.getElementById(`inputNmb`).innerHTML = nmbToShow;
        //save mementos
        mementos.push([...array1]);
        //insert data to array set
        for(var i = 0; i < nmbOfInsert;i++){array1.unshift(input);}
        var moveData = array1.splice(nmbOfInsert,queueNmb-1);
        for(var i=moveData.length; i > 0 ;i--){array1.unshift(moveData.pop());} //rearrange the data
        moves--;
        mementos2.length = 0; //clear redo
        recreateDataSlide();
        recreateInputsAndDD();
    if(playMusic == true){
        audio_insert.currentTime = 0;
        audio_insert.play();
    }
    setTimeout(() => {winCheck();}, 0);
    if(all == "All"){nmbToShow = "All";}
}
function removeData(set, queueNmb2, nmbOfRemove){
    if(document.getElementById(`startScreen_checkBox`).checked != true){return false;}
    if(adjustRunning == true){return false;}
    if(set == `randomMove`){
        //auto solve Message
        if(nmbOfRemove == 1){mementos5.push(`<big>Move :</big>Remove<br><big>Data: </big>${nmbOfRemove} x <br>${array2[queueNmb2-1]}`);} 
        else {mementos5.push(`<big>Move: </big>Remove<br><big>Data: </big>${nmbOfRemove} x <br>${array2[queueNmb2-1]}' ~ '${array2[queueNmb2 - 1 + nmbOfRemove]}'`);}
        //remove Data
        array2.splice(queueNmb2 - 1, nmbOfRemove)
        mementos4.push([...array2]);
        return false;
    }
    checkMoves();
    if(array1.length == 0 || moves == 0){return false;}
        //save mementos
        mementos.push([...array1]);
        //remove Data
        nmbOfRemove = document.getElementById("rngNmb").value;
        queueNmb2 = document.getElementById("queueNmb2").value;
        array1.splice(queueNmb2 - 1, nmbOfRemove)
        //change, display nmbToShow
        var all = nmbToShow;
        if(all == "All" || all > array1.length){nmbToShow = array1.length;}
        document.getElementById(`inputNmb`).innerHTML = nmbToShow;
        moves--;
        mementos2.length = 0; //clear redo
        recreateDataSlide();
        recreateInputsAndDD();
    if(playMusic == true){
        audio_remove.currentTime = 0;
        audio_remove.play();
    }
    setTimeout(() => {winCheck();}, 0);
}
function replaceData(set, input2, queueNmb2_2){
    if(document.getElementById(`startScreen_checkBox`).checked != true){return false;}
    if(adjustRunning == true){return false;}
    if(set == `randomMove`){
        //auto solve Message
        mementos5.push(`<big>Move:</big> Replace<br><big>Data: </big>${input2}</big><br><big>With: </big>${array2[queueNmb2_2 - 1]}`);
        //replace data
        array2.fill(input2,queueNmb2_2 - 1, queueNmb2_2);
        mementos4.push([...array2]);
        return false;
    }
    checkMoves();
    if(array1.length == 0 || moves == 0){return false;}
        //Get input data
        input2 = document.getElementById("selectedDataValue").innerHTML;
        if (input2 == empty) {alert(`Select item from "Click Me!" menu`);return false;}
        queueNmb2_2 = document.getElementById("queueNmb2_2").value;
        if(input2 == array1[queueNmb2_2 - 1]){ //Confirm replace same object
            let confirmReplace = confirm(`Are you sure that you want to replace with same object?`);
            if(confirmReplace == false){return false;}
        }
        //save mementos
        mementos.push([...array1]);
        //replace data
        array1.fill(input2,queueNmb2_2 - 1, queueNmb2_2); //fill(value, start[0 is 1st], end[1 is 1st])
        moves--;
        mementos2.length = 0; //clear redo
        recreateDataSlide();
        recreateInputsAndDD();
    if(playMusic == true){
        audio_replace.currentTime = 0;
        audio_replace.play();
    }
    setTimeout(() => {winCheck();}, 0);
}
function undo(){
    if(adjustRunning == true){return false;}
    if(mementos.length == 0){alert(`No undo move.`);return false;}
    //save mementos2
    mementos2.push([...array1]);
    //undo
    var undoMementos = [];
    undoMementos = mementos.pop();
    array1 = [...undoMementos];
    moves += 1;
    nmbDataToShow("All");
    recreateDataSlide();
    recreateInputsAndDD();
    displayUndoRedoMoves();
}
function redo(){
    if(adjustRunning == true){return false;}
    if(mementos2.length == 0){alert(`No redo move.`); return false;}
    checkMoves();
    if(moves == 0){return false;}
    //save mementos
    mementos.push([...array1]);
    //redo
    var redoMementos = [];
    redoMementos = mementos2.pop();
    array1 = [...redoMementos];
    moves--;
    mementos2.length = 0; //clear redo
    nmbDataToShow("All");
    recreateDataSlide();
    recreateInputsAndDD();
    displayUndoRedoMoves();
    checkMoves();
}
function resetAllMementos(){
    mementos.length = 0;
    mementos2.length = 0;
    mementos3.length = 0;
    mementos4.length = 0;
    mementos5.length = 0;
}
function validateNmb(input) {
    let x = input.value, regex = /^[0-9]+$/;
    if (x.length > 0){input.value = x.substr(0, 1);} //max length = 1
    if (!regex.test(x) || x < 1){input.value = 1;} //auto delete non numbers

    
}
//Game
async function generateData(obj){ //Generate Random Data based on level
    if(document.getElementById(`startScreen_checkBox`).checked != true){return false;}
    if(adjustRunning == true){return false;}
    if(generateDataRunning == true){return false;}
    t0 = performance.now();
    generateDataRunning = true;
    win = false;
    playMusic = false;
    document.getElementById(`body`).style.pointerEvents = `none`;
    document.getElementById(`message`).className = `disappear`;
    document.getElementById(`message`).innerHTML = ``;
    resetAllMementos();
    createLoader();
    //get generated Mode, Moves, Goal, Resources then Load data on screen
    let mode = await generateMode(obj);
    generateMoves();
    generateGoal(mode);
    loadDataOnScreen();
    recreateResources();
    t1 = performance.now();
    console.log(`It took ${((t1 - t0)/1000).toFixed(2)} seconds to load the game.`)
    await createTimer(false); //no need to minus move
    //display level,resources,btn on screen
    document.getElementById(`showLevel`).innerHTML = `Level ${level}`;
    document.getElementById(`resources`).className = `flex`;
    document.getElementById(`body`).style.pointerEvents = `auto`;
    generateDataRunning = false;
    setTimeout(() => {winCheck();}, 0);
}
function generateMode(obj){
    //Reset and generate data
    array1 = [];
    array2 = [];
    let arrayOpt;
    //Random to get specific obj
    if(obj == `NoImgMode`){
        arrayOpt = [`numbers`,`alphabets`,`mix`];
        obj = arrayOpt[Math.floor(Math.random() * arrayOpt.length)];
    }
    if(obj == `imgMode` || obj == null){
        arrayOpt = [`demonSlayer`, `animals`, `baoZhai`, `chess`];
        obj = arrayOpt[Math.floor(Math.random() * arrayOpt.length)];
    }
    currentMode = obj;
    //Generate array1 & array2 content with specific obj
    if(obj == `numbers`){
        for(var i = 0; i < 5;i++){array1.push(generatePassword(`numbers`));}
        showImg = false;
    }
    if(obj == `alphabets`){
        for(var i = 0; i < 5;i++){array1.push(generatePassword(`alphabets`));}
        showImg = false;
    }
    if(obj == `mix`){
        for(var i = 0; i < 5;i++){array1.push(generatePassword(`mix`));}
        showImg = false;
    }
    if(obj == `demonSlayer`){
        for(var i = 0; i < 5;i++){array1.push(anime.demonSlayer[i].firstName);}
        showImg = true;
    }
    if(obj == `animals`){
        for(var i = 0; i < 5;i++){array1.push(`a${i}`);}
        showImg = true;
    }
    if(obj == `baoZhai`){
        for(var i = 0; i < 5;i++){array1.push(`b${i}`);}
        showImg = true;
    }
    if(obj == `chess`){
        for(var i = 0; i < 5;i++){array1.push(`c${i}`);}
        showImg = true;
    }
    array2 = [...array1];
    array3 = [...array1]; //clone data to Array3 for resources
    return Promise.resolve(obj)
}
function loadDataOnScreen(){
    return new Promise((Resolve) => { //Clear Message and recreate
        nmbDataToShow(`All`); // Create Goal Slide
        nmbDataToShow2(`All`); // Create Data Slide
        recreateInputsAndDD();
        setTimeout(() => {
            closeLoader();
            window.scrollTo(0, 0);
            Resolve();
        }, 500) ;
    });
}
function generatePassword(type){
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var charset2 = "0123456789";
    var password = "";
    if(type == `mix`){
        var length = 3;
        for (var i = 0, n = charset.length; i < length-2; i++) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        for (var i = 0, n = charset2.length; i < length-1; i++) {
            password += charset2.charAt(Math.floor(Math.random() * n));
        }
    }
    if(type == `alphabets`){
        var length = 1;
        for (var i = 0, n = charset.length; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
    }
    if(type == `numbers`){
        var length = 1;
        for (var i = 0, n = charset2.length; i < length; i++) {
            password += charset2.charAt(Math.floor(Math.random() * n));
        }
    }
    return password;
}
function generateGoal(obj){ //Generate by Random Moves
    let targetGoalSlides = 2 + level;
    //Random number of Solve moves
    let solveMoves = Math.floor(Math.random() * 2) + 4; //random from 4,5 [max solve moves needed is 3 or 4 or 5]
    if(level >= 5){
        targetGoalSlides = 8;
        solveMoves = Math.floor(Math.random() * 3) + 8; //random from 8,9,10 [max solve moves needed is 8 or 9 or 10]
    }
    console.log("solveMoves: " + solveMoves);
    for(var i = solveMoves; i > 0 ; i--){
        var currentGoalSlides = array2.length; //current goal slide
        var randomMoves = Math.floor(Math.random() * 10) + 1; //1,2,3 are random, 4 and above are fixed
        var randomInput = array3[Math.floor(Math.random() * array3.length)] //random Input data
        var randomLocation, randomNmbOfInsert, randomNmbOfRemove;
        // Restrict Random Moves [Pseudo Random]
        if (i == 1){ //when it is last moves
            if(currentGoalSlides < targetGoalSlides){randomMoves = 1;} //100% insert
            if(currentGoalSlides > targetGoalSlides){randomMoves = 2;} //100% remove
            if(currentGoalSlides == targetGoalSlides){randomMoves = 3;} //100% replace
        }        
        else if(randomMoves >= 4){
            if(currentGoalSlides < targetGoalSlides){randomMoves = 1;} //80% insert, 10% remove, 10% replace
            if(currentGoalSlides > targetGoalSlides){randomMoves = 2;} //80% remove, 10% insert, 10% replace
            if(currentGoalSlides == targetGoalSlides){randomMoves = 3;} //80% replace, 10% insert, 10% remove
        }
        //Execute Random Moves
        if(randomMoves == 1){ //Insert
            //Most left to Most right
            randomLocation = Math.floor(Math.random() * (currentGoalSlides + 1))+1;
            //restrict number of Insert. E.g: targetGoalSlides = 4, then randomNmbOfInsert = 1 ~ 2
            randomNmbOfInsert = Math.floor(Math.random() * (targetGoalSlides*0.5)) + 1;
            if(i == 1){
                randomNmbOfInsert = targetGoalSlides - currentGoalSlides;
            }
            insertData(`randomMove`, randomInput, randomNmbOfInsert, randomLocation);
        }
        if(randomMoves == 2){ //Remove
            if(array2.length == 0){console.log(`Nmb of Goal slide is 0, can not perform "Remove"!`); i++; continue;}
            randomLocation = Math.floor(Math.random() * (currentGoalSlides)) + 1;
            //restrict number of remove. E.g: currentGoalSlides = 4, randomLocation = 3, then randomNmbOfRemove = 2
            randomNmbOfRemove = Math.floor(Math.random() * (currentGoalSlides - randomLocation)*0.5) + 1;
            if(i == 1){
                randomNmbOfRemove = currentGoalSlides - targetGoalSlides;
                randomLocation = 1;
            }
            removeData(`randomMove`, randomLocation, randomNmbOfRemove);
        }
        if(randomMoves == 3){ //Replace            
            randomLocation = Math.floor(Math.random() * (currentGoalSlides)) + 1;
            if(randomInput == array2[randomLocation - 1]){console.log(`Same object detected!`); i++; continue;}
            replaceData(`randomMove`, randomInput, randomLocation);
        }
    }
    console.log(`Number of goal slides: ${targetGoalSlides}\nFinal goal slide: ${array2}`);
    if(mute == false){playMusic = true;}
    if(playMusic == true){
        if(obj == `demonSlayer`){
            audio_startGame.pause();
            audio_homura.currentTime = 0;
            audio_homura.play();
            audio_homura.loop = true;
        }
        else { //non demon slayer (audio)
            audio_homura.pause();
            audio_startGame.currentTime = 0;
            audio_startGame.play();
            }
    }
}
function startGame(){ //first time start game
    document.getElementById(`startScreen_checkBox`).checked = true;;
    document.getElementById(`startScreen`).className = `disappear`;
    generateData(currentMode);
}
function generateMoves(){
    moves = 5
    if(level >= 5){moves = 10;}
}
function winCheck(){
    if(array1.length != array2.length){return checkMoves();}
    for(i = 0; i < array1.length; i++){if(array1[i] != array2[i]){return checkMoves();}}
    if(playMusic == true){
        audio_win.currentTime = 0;
        audio_win.play();
    }
    win = true;
    alert(`You have completed level ${level}`);
    closeCurtain();
    setTimeout(() => {nextLevel();}, 500);
}
function nextLevel(){
    var nextLevel = confirm(`"OK" to next level?\n"Cancel" to play again current level`);
    if(nextLevel == true){level += 1;}
    generateData(currentMode);
}
function checkMoves(){
    if(win == true){return false;}
    if(moves == 0){
        console.log("asdf");
        if(playMusic == true){
            audio_noMoreMoves.currentTime = 0;
            audio_noMoreMoves.play();
        }
        alert(`No more moves`);
        var restartLevel = confirm("Restart level?");
        if(restartLevel == true){generateData(currentMode);}
    }
}
//Curtain
function curtainAnimation(){
    if(viewInside == true){
        document.getElementById(`curtain_left`).className = `curtain_panel curtain_openLeft`;
        document.getElementById(`curtain_right`).className = `curtain_panel curtain_openRight`;
    }
    else {
        document.getElementById(`curtain_left`).className = `curtain_panel curtain_close`;
        document.getElementById(`curtain_right`).className = `curtain_panel curtain_close`;
    }
}
function openCurtain(){
    viewInside = true;
    curtainAnimation();
}
function closeCurtain(){
    viewInside = false;
    curtainAnimation();
}
//Solution
function autoSolve(){
    if(solveRunning == true){return false;}
    var startSolve = confirm("Start auto solve?");
    if(startSolve == false){return false;}
    clearInterval(hintInterval);
    solveRunning = true;
    document.getElementById(`body`).style.pointerEvents = `none`;
    document.getElementById(`resources`).className = `disappear`;
    document.getElementById(`message`).className = `block`;
    //Revert back to beginning
    array1 = array3;
    generateMoves();
    nmbDataToShow2(`All`, true); //Show all and recreate slide
    nmbDataToShow(`All`, true); //Show all and recreate slide
    openCurtain();
    //start solving
    setTimeout(() => {
        solve();
        solveInterval = setInterval(() => {solve();}, 1000);
    }, 1000);
}
function solve(){
    var solveMementos = [];
    solveMementos = mementos4.shift();
    solvingMoves = mementos5.shift();
    createMessage(solvingMoves);
    array1 = [...solveMementos];
    moves--;
    document.getElementById("moves").innerHTML = `${moves}`;
    nmbDataToShow(`All`, true); //stop solve in recreateDataSlide()
}
function createMessage(msg){
    var message = document.getElementById(`message`);
    var divDarkBox = document.createElement("div"),p = document.createElement("p"), img = document.createElement("img"),src = document.createAttribute("src");
    divDarkBox.className =  `darkerBox`;
    src.value = `img/demonSlayer/Shinobu.jpg`;
    img.setAttributeNode(src);
    p.innerHTML = `${msg}`;
    divDarkBox.appendChild(img);
    divDarkBox.appendChild(p);
    message.appendChild(divDarkBox); //clear message is written in winCheck
}
//Alert message
function copyText(this_id){
    if(copyAlertRunning == true){return false;}
    copyAlertRunning = true;
    if(playMusic == true){
        audio_copy.currentTime = 0;
        audio_copy.play();
    }
    //find range (copiedText)
    if(this_id.indexOf("&") < 0){this_id = this_id.substring(0,this_id.indexOf("ce")+3);} //get resource1
    var copiedText = document.createRange();
    copiedText.selectNode(document.getElementById(`${this_id}`));//select id
    // window.getSelection().removeAllRanges(); // clear current selection
    // window.getSelection().addRange(copiedText); // to select text			
    // document.execCommand("copy");
    var selectedDataImg = document.getElementById("selectedDataImg");
    if(selectedDataImg != null){selectedDataImg.remove();}
    document.getElementById("selectedDataValue").innerHTML = `${copiedText}`;
        //if need to show image then only create
        if(showImg == true){
            //create div images
            var divImg = document.createElement("div"),id = document.createAttribute("id");
            id.value = `selectedDataImg`
            divImg.setAttributeNode(id);
            divImg.className = `overlay`;
            //create img
            var img = document.createElement("img"),src = document.createAttribute("src");
            img.style.cssText = `width: 100%; height: 101%; border-radius: 17%;`
            src.value = ``;
            for(k = 0; k < 5; k++){
                if(copiedText == ImagePath(k)){
                    src.value = `img/${currentMode}/${ImagePath(k)}.jpg`;
                    break;
                }
            }
            //div1 Items append div Img
            img.setAttributeNode(src);
            divImg.appendChild(img);
            document.getElementById("selectedData").appendChild(divImg);
            //add hover effect to div2 - carousel-inner
            var css = document.createTextNode(`#selectedData:hover .overlay{opacity: 0;}`);
            var head = document.getElementsByTagName('head'), style = document.createElement('style');
            style.appendChild(css);
            head[0].appendChild(style);
            clearDuplicateStyle();
            } 
    //alert
    setTimeout(() => {customAlert(copiedText,650,this_id);},100) //call alert func with 100 ms delay			
}
function customAlert(msg,duration,this_id){
    //create Alert
    if(this_id.indexOf("&") < 0){
        id = this_id.substring(0,this_id.indexOf("ce")+3);
        var currentDiv = document.getElementById(`${id}`);
        var alt = document.createElement("div"), id = document.createAttribute("id");
        id.value = `alertItem`;
        alt.setAttributeNode(id);
        alt.setAttribute("style","position:fixed; border-radius: 10px; bottom: 60px; left: 120px; background-color:white; color: grey; line-height: 20px; opacity: 0.6; font-size: 11px; width: 60px; height: 20px");
        alt.innerHTML = msg;
        currentDiv.appendChild(alt);
        //remove Alert
        setTimeout(() => {
            alt.parentNode.removeChild(alt);
            copyAlertRunning = false;
        },duration);
    }
}
//timer
function timeLimit(){
    var currentTimeLimit = TIME_LIMIT;
    if(level > 5){currentTime = 7;}
    return currentTimeLimit;
}
function createTimer(minusMove){
    if(document.getElementById(`startScreen_checkBox`).checked != true){return false;}
    if(moves <= 1){ alert(`Utilize your last moves!`); return false;}
    return new Promise((Resolve) => {
        document.getElementById(`solveBtn`).style.pointerEvents = `none`;
        document.getElementById("startTimerBtn").style.display = `none`;
        //create timer
        var divTimer = document.createElement("div"),id = document.createAttribute("id");
        id.value = `timer`;
        divTimer.setAttributeNode(id);
        divTimer.style.display = `inline-block`;
        divTimer.innerHTML = `
        <div class="base-timer">
            <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g class="base-timer__circle">
                <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
                <path
                    id="base-timer-path-remaining"
                    stroke-dasharray="283"
                    class="base-timer__path-remaining ${remainingPathColor}"
                    d="
                    M 50, 50
                    m -45, 0
                    a 45,45 0 1,0 90,0
                    a 45,45 0 1,0 -90,0
                    ">
                    </path>
                </g>
            </svg>
            <span id="base-timer-label" class="base-timer__label">${formatTime(timeLimit())}</span>
        </div>`;
        document.getElementById(`startBtnAndTimer`).appendChild(divTimer);
        if(playMusic == true){
            audio_timer.currentTime = 0;
            audio_timer.play();
            audio_timer.loop = true;
        }
        //minus moves then start timer
        if(moves > 1 && minusMove != false){
                moves--;
                document.getElementById("moves").innerHTML = `${moves}`;
        }
        openCurtain();
        timerInterval = setInterval(() => {
            timePassed ++;
            timeLeft = timeLimit() - timePassed;
            document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
            setCircleDasharray();
            setRemainingPathColor(timeLeft);
            if (timeLeft === 0){
                stopTimer();
                Resolve();
            }
        }, 1000);
    });
}
function stopTimer(){
    clearInterval(timerInterval);
    document.getElementById(`solveBtn`).style.pointerEvents = `auto`;
    document.getElementById("startTimerBtn").style.display = `inline-block`;
    document.getElementById("timer").remove();;
    timeLeft = timeLimit();
    timePassed = 0;
    closeCurtain();
    audio_timer.pause();
}
function formatTime(time){
//   const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  if (seconds < 10) {seconds = `0${seconds}`;}
  return `${seconds}`; //${minutes}:${seconds}`
}
function setRemainingPathColor(timeLeft) {
    const {info, warning, alert} = COLOR_CODES;
    if (timeLeft <= warning.threshold){
        document.getElementById("base-timer-path-remaining").classList.remove(info.color);
        document.getElementById("base-timer-path-remaining").classList.add(warning.color);
    }
    if (timeLeft <= alert.threshold){
        document.getElementById("base-timer-path-remaining").classList.remove(warning.color);
        document.getElementById("base-timer-path-remaining").classList.add(alert.color);
    }
}
function setCircleDasharray() {
    const percentage = timeLeft/timeLimit() - (1 / timeLimit()) * (1 - timeLeft/timeLimit()); //just a formula
    document.getElementById("base-timer-path-remaining").setAttribute("stroke-dasharray", `${(percentage * 283).toFixed(0)} 283`);
}
//Hints
function insertHint(){
    clearInterval(hintInterval);
    if(array1.length == 0){return false;}
    //remain show all, if "All" is selected
    var all = nmbToShow;
    if(all == "All"){nmbToShow = array1.length;}
    //save mementos3 and reset hint
    mementos3.push(`insertHint`);
    resetBorder();
    //adjustment
    var queueNmb = parseInt(document.getElementById("queueNmb").value);
    var afterAdjust = queueNmb + adjustment;
    if(adjustment < 0 && afterAdjust <= 0){
            afterAdjust = Math.abs(afterAdjust + array1.length);
    }
    if(adjustment > 0 && afterAdjust > array1.length){
            afterAdjust = Math.abs(afterAdjust - array1.length);
    }
    //find insert location
    if(afterAdjust == 1){//Most Left
        document.getElementById(`myCarousel1`).style.borderLeftColor = `blue`;
        hintInterval = setInterval(() => {blink(`insert`)}, 650);
        if(all == "All"){nmbToShow = "All";}
        return false;
    }
    if(afterAdjust == nmbToShow + 1){//Most Right
        document.getElementById(`myCarousel${nmbToShow}`).style.borderRightColor = `blue`;
        hintInterval = setInterval(() => {blink(`insert`)}, 650);
        if(all == "All"){nmbToShow = "All";}
        return false;
    }
    if(afterAdjust > nmbToShow){//Out of range
        resetBorder();
        if(all == "All"){nmbToShow = "All";}
        return false;
    }
    //In between 2 data
    document.getElementById(`myCarousel${afterAdjust-1}`).style.borderRightColor = `blue`;
    document.getElementById(`myCarousel${afterAdjust}`).style.borderLeftColor = `blue`;
    hintInterval = setInterval(() => {blink(`insert`)}, 650);
    if(all == "All"){nmbToShow = "All";}
}
function removeHint(){
    clearInterval(hintInterval);
    if(array1.length == 0){return false;}
    //remain show all, if "All" is selected
    var all = nmbToShow;
    if(all == "All"){nmbToShow = array1.length;}
    //save mementos3 and reset hint
    mementos3.push(`removeHint`);
    resetBorder();
    //adjustment
    var queueNmb2 = parseInt(document.getElementById("queueNmb2").value);
    var afterAdjust = queueNmb2 + adjustment;
    if(adjustment < 0 && afterAdjust <= 0){
            afterAdjust = Math.abs(afterAdjust + array1.length);
    }
    if(adjustment > 0 && afterAdjust > array1.length){
            afterAdjust = Math.abs(afterAdjust - array1.length);
    }
    //find remove locations
    var rngNmb = parseInt(document.getElementById("rngNmb").value);
    var normalRng = afterAdjust + rngNmb - 1;
    if(normalRng > array1.length){//from 1st slide (hint on both side)
        for(var j = 0; j < normalRng - array1.length; j++){
            document.getElementById(`myCarousel${j+1}`).style.border = `5px solid blue`;
        }
    }
    //from targeted to end
    for(var i = afterAdjust, j = rngNmb; i < i + j; i++, j--){
        if(i > nmbToShow){//out of range
            if(all == "All"){nmbToShow = "All";}
            hintInterval = setInterval(() => {blink()}, 650);
            return false;
        }
        document.getElementById(`myCarousel${i}`).style.border = `5px solid blue`;
    }
    hintInterval = setInterval(() => {blink()}, 650);
    if(all == "All"){nmbToShow = "All";}
}
function replaceHint(){
    clearInterval(hintInterval);
    if(array1.length == 0){return false;}
    //remain show all, if "All" is selected
    var all = nmbToShow;
    if(all == "All"){nmbToShow = array1.length;}
    //save mementos3 and reset hint
    mementos3.push(`replaceHint`);
    resetBorder();
    //adjustment
    var queueNmb2_2 = parseInt(document.getElementById("queueNmb2_2").value);
    var afterAdjust = queueNmb2_2 + adjustment;
    if(adjustment < 0 && afterAdjust <= 0){afterAdjust = Math.abs(afterAdjust + array1.length);} //
    if(adjustment > 0 && afterAdjust > array1.length){afterAdjust = Math.abs(afterAdjust - array1.length);}
    if(afterAdjust > nmbToShow){//Out of range
        resetBorder();
        if(all == "All"){nmbToShow = "All";}
        return false;
    }
    //change border color for selected data
    document.getElementById(`myCarousel${afterAdjust}`).style.border = `5px solid blue`;
    hintInterval = setInterval(() => {blink()}, 650);
    if(all == "All"){nmbToShow = "All";}
}
//Hints adjustment
function adjust(adjustValue){
    if(adjustRunning == true){return false;}
    adjustRunning = true;
    //disable the Next and Previous button
    setTimeout(() => {document.getElementById(`previousNext`).style.pointerEvents = "none";},125)
    adjustment = adjustment + adjustValue;
    console.log(adjustment);
    if(Math.abs(adjustment) == array1.length){adjustment = 0;} //prevent out of range
    //adjust hints and image after the slider animation
    setTimeout(adjustHints,750)
}
function adjust2(adjustValue){
    if(adjustRunning == true){return false;}
    adjustRunning = true;
    //disable the Next and Previous button
    setTimeout(() => {document.getElementById(`previousNext2`).style.pointerEvents = "none";},125)
    adjustment2 = adjustment2 + adjustValue;
    if(Math.abs(adjustment2) == array2.length){adjustment2 = 0;} //prevent out of range
    //adjust image
    setTimeout(adjustImage2,750);
}
function adjustHints(){
    //check and execute previous triggered Hint
    var previousAction = mementos3.pop();
    if(previousAction == `insertHint`){insertHint();}
    if(previousAction == `removeHint`){removeHint();}
    if(previousAction == `replaceHint`){replaceHint();}
    if(showImg == false){
        document.getElementById(`previousNext`).style.pointerEvents = "auto";
        adjustRunning = false;
        return false;
    }
    //adjust image
    adjustImage();
}
function adjustImage(){
    for(var i = 0; i < nmbToShow; i++){
        //get current data display on the screen
        var inner = document.getElementById(`carousel-inner${i + 1}`);
        var activeItem = inner.querySelector(`.active`);
        var data = activeItem.querySelector(`.data`).innerText;
        //set image based on the data
        for(var j = 0; j < array1.length; j++){
            for(k = 0; k < 5; k++){
                if(data == ImagePath(k)){
                    var img = inner.getElementsByTagName('img')[j];
                    img.src = `img/${currentMode}/${ImagePath(k)}.jpg`;
                    break;
                }
            }
        }
    }
    document.getElementById(`previousNext`).style.pointerEvents = "auto";
    adjustRunning = false;
}
function adjustImage2(){
    for(var i = 0; i < nmbToShow2; i++){
        //get current data display on the screen
        var inner = document.getElementById(`carousel-innerY${i + 1}`);
        var activeItem = inner.querySelector(`.active`);
        var data = activeItem.querySelector(`.data`).innerText;
        //set image based on the data
        for(var j = 0; j < array2.length; j++){
            for(k = 0; k < 5; k++){
                if(data == ImagePath(k)){
                    var img = inner.getElementsByTagName('img')[j];
                    img.src = `img/${currentMode}/${ImagePath(k)}.jpg`;
                    break;
                }
            }
        }
    }
    document.getElementById(`previousNext2`).style.pointerEvents = "auto";
    adjustRunning = false;
}
function resetBorder(){
    var all = nmbToShow;
    if(all == "All"){nmbToShow = array1.length;}
    //reset border
    for(var i = 0; i < nmbToShow; i++){
        if(i == array1.length){break;};
        document.getElementById(`myCarousel${i+1}`).style.border = `5px solid black`;
    }
    if(all == "All"){nmbToShow = "All";}
}
function blink(blinkObj){
    var all = nmbToShow;
    if(all == "All"){nmbToShow = array1.length;}
    if(blinkObj == `insert`){
        for(var i=0; i < nmbToShow; i++){
            if(i == array1.length){break;};
            var data = document.getElementById(`myCarousel${i+1}`);
            if(data.style.borderLeftColor != `black`){
                data.style.borderLeftColor = (data.style.borderLeftColor == `blue`? "transparent":`blue`);
            }
            if(data.style.borderRightColor != `black`){
                data.style.borderRightColor = (data.style.borderRightColor == `blue`? "transparent":`blue`);
            }
        }
        if(all == "All"){nmbToShow = "All";}
        return false;
    }
    for(var i=0; i < nmbToShow; i++){
        if(i == array1.length){break;};
        var data = document.getElementById(`myCarousel${i+1}`);
        if(data.style.border != `5px solid black`){
            data.style.border = (data.style.border == `5px solid blue`? "5px solid transparent":`5px solid blue`);
        }
    }
    if(all == "All"){nmbToShow = "All";}
}
//Music
function muteMusic(){
    playMusic = false;
    mute = true;
    audio_timer.pause();
    audio_homura.pause();
    audio_startGame.pause();
    audio_win.pause();
}
function unmuteMusic(){
    playMusic = true;
    mute = false;
    //Check previous playing song, continue to play (not start from 0)
    if(currentMode == "demonSlayer"){
        audio_homura.play();
        audio_homura.loop = true;
    } else {audio_startGame.play();}
}
//Loader
function createLoader(){
    if(loaderRunning == true){return false;}
    loaderRunning = true;
    var body = document.getElementById('body'), divLoader = document.createElement("div"),id = document.createAttribute("id");
    id.value = `loader`;
    divLoader.setAttributeNode(id);
    body.style.opacity = "0.5";
    body.appendChild(divLoader);
}
function closeLoader(){
    document.getElementById("body").style.opacity = "1";
    document.getElementById("loader").remove();
    loaderRunning = false;
}
//Others
function showSingleMultipleBox(){
    document.getElementById("multipleBox").style.display = `inline`;
    document.getElementById("singleBox").style.display = `none`;
    if(document.getElementById(`single`).checked == true){
        document.getElementById("singleBox").style.display = `inline`;
        document.getElementById("multipleBox").style.display = `none`;
    }

}
function ImagePath(k){
    if(currentMode == `demonSlayer`){return anime.demonSlayer[k].firstName;}
    if(currentMode == `animals`){return `a${k}`;}
    if(currentMode == `baoZhai`){return `b${k}`;}
    if(currentMode == `chess`){return `c${k}`;}
}