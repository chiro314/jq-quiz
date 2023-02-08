
//OBJECT QUESTION :

let question = {
    "number" : -1, //the index in "instancesTable"
    "id" : "", // = "question_"+number
    "question" : "",
    "reponse" : "",  //the correct answer
    "reponses" : [], //suggested answers, the correct answer included

    "reponseJoueur" : "",
    bonneReponse : function() {
        if(this.reponseJoueur == this.reponse) return true;
        else return false;
    },
    score : function(){
        if(this.bonneReponse()) return this.number+' - '+this.question+' : "'+this.reponseJoueur+'" : bien joué !';
        else return this.number+' - '+this.question+' : "'+this.reponseJoueur+'" : mauvaise réponse, il fallait répondre "'+this.reponse+'"';
    },
    afficherScore : function(){
        $("#div-histo").append("<p>"+this.score()+"</p>");
    },

    //Display the question on the screen :
    createHMI : function() {

        $("#div-question").html("<p>"+this.question+"</p>");

        $("#div-reponses").html("");
        for(i=0;i<this.reponses.length;i++){
            $("#div-reponses").append('<input type="radio" id="reponse'+
                                     i+
                                     '" name="reponse" value="'+
                                     this.reponses[i]+
                                     '"><label for="reponse'+
                                     i+
                                     '">'+
                                     this.reponses[i] +
                                     '</label>')
            ;
        } 
        $("#div-reponses > label").addClass("mr-3");
    }
};

//DATA :

const tabTitres =["Surnoms 1", "Surnom 2"];             //Theme
const tabBackground = ["background.png", "ciel.jpg"];  //theme background
const tabConsignes =["Une seule réponse possible par question", "Une seule réponse possible"];  //theme order

const tabQuestionsReponses =
[
    [                                                       //first theme
        ['Elisabeth II','Lilibeth','Liz','Zaza'],               //question, corect answer, false answer(s)...
        ['Lionel Jospin','Yoyo','Jojo','Lolo']
    ],
    [                                                       //second theme
        ['Francisco Franco','Franquito','FF'],
        ['Manuel Valls','Pepe','Manu'],
        ['Marlon Brando','Bud','Dad']
    ]   
];

//FUNCTIONS :

//Built a tab at random and return it :
var maBanqueAlea = [];
function aleaTab(tableau){
    //indexes miror :
    index = [];
    for(j=0; j<tableau.length;j++) index[j] = j;

    //Mixing the indexes : a number is taken at random, then a second one is taken at random from the remaining numbers, and so on until the numbers run out :  
    indexAlea = [];
    for(j=tableau.length -1; j>-1; j--) indexAlea[tableau.length-1-j] = index.splice(Math.floor(Math.random() * (j+1)),1);

    //Then a new reference table is built, using the randomized numbers :
    maBanqueAlea = [];
    for(j=0; j<tableau.length;j++) maBanqueAlea[j] = tableau[indexAlea[j]];

    return maBanqueAlea;
}

//PROGRAMME :

var quizNumber = 0; //theme = "surnoms 1" (by default) 
let gameIn = false;    //to manage the buttons and the navigation.
let gameOver = false;  //to manage the buttons and the navigation.

//HMI :
$("#bt-accueil").hide();
//$("#row-score").hide(); //empty. Kept to get hight
$("#row-question").hide();

//Themes listbox (the value is the index in the data table):
for(i=0;i<tabTitres.length;i++) $("#select-theme").append('<option value="'+i+'">'+tabTitres[i]+'</option>');

function themeInit(){
    
    //Titre : 
    $("h1").text("QUIZ en "+ tabQuestionsReponses[quizNumber].length +" questions sur les "+tabTitres[quizNumber]);

    //Consigne :
    $("#p-consigne").text(tabConsignes[quizNumber]);

    //Background :
    $("#container").css("background-image", "url(" + tabBackground[quizNumber]+ ")");

    gameIn = false;    //to manage the buttons and the navigation.
    gameOver = false;  //to manage the buttons and the navigation.
}
themeInit();

//Getting the chosen theme if changed :
$("#select-theme").change(function(){
    if(!gameIn){
        //theme :
        quizNumber = $("#select-theme").val();

        themeInit();
        /*
        //Background :
        $("#container").css("background-image", "url(" + tabBackground[quizNumber]+ ")");
        //Titre : 
        $("h1").text("QUIZ en "+ tabQuestionsReponses[quizNumber].length +" questions sur les "+tabTitres[quizNumber]);
        //Consigne :
        $("#p-consigne").text(tabConsignes[quizNumber]);
        */
    }
    else $("#select-theme").val(quizNumber);
});


//"C'est parti" button => beginning of a game :

let tabQuestionsTheme = [];
let questionInProgressNumber = -1;

//$(document).ready(function() {
$("#bt-instancier").click(function(){
    alert("gameIn : "+gameIn);
    if(!gameIn){
        gameIn=true; //to manage the Theme buttons's clicks

        //HMI :
            $("#bt-accueil").show();
            $("#bt-instancier").hide();
            $("#row-score").hide(); 
            $("#row-question").show();
        
        //Built a random questions tab :
   
        var tabQuestionsThemeDraft = tabQuestionsReponses[quizNumber]; //get the theme questions
        var tabQuestionsThemeDraftRandom = aleaTab(tabQuestionsThemeDraft); //sort the questions
    
        var reponsesDraft = [];
        var reponsesDraftRandom = [];
        var questionDraft = [];
        tabQuestionsTheme = [];
        
        for(i=0;i<tabQuestionsThemeDraftRandom.length;i++){ //sort the answers
            reponsesDraft = [].concat(tabQuestionsThemeDraftRandom[i]);
            questionDraft[0] = reponsesDraft.shift(); //suppress and get the first element (the question)
            reponsesDraftRandom = aleaTab(reponsesDraft); //sort the answers
            tabQuestionsTheme[i] = questionDraft.concat(reponsesDraftRandom);
        }

        //Create and record the "question" objects for this game, and show the first Question :

        instancesTable = []; //Objects table (question objects)
        
        var myQuestion = null;

        for(i=0;i<tabQuestionsTheme.length;i++){ 
            
            myQuestion = Object.create(question);

            myQuestion.number = i; 
            myQuestion.id = "question_"+i; 
            myQuestion.question = tabQuestionsTheme[i][0];
            myQuestion.reponse = tabQuestionsThemeDraftRandom[i][1]; //before horizontal sort
            myQuestion.reponses = [].concat(tabQuestionsTheme[i].slice(1));

            instancesTable.push(myQuestion); 
        }

        //Display the first question :
        questionInProgressNumber+=1;
        instancesTable[questionInProgressNumber].createHMI();  

    }   //if(!gameIn){...
    
});     //$("#bt-instancier").click(function(){
//});     //ready

//"Accueil" button events :

$("#bt-accueil").click(function(){ 
    
    if(gameOver){  //Back to "Accueil" screen from the score screen
        gameOver=false;
        gameIn=false;
        questionInProgressNumber=-1;
        //HMI :
        $("#bt-accueil").hide();
        $("#bt-instancier").show();
        $("#row-question").hide();
        $("#row-score").show(); 
        $("#div-histo").html("");
        $("#p-score").html("");
    }
    else showScore();  //Show the score (even when the game is given up)
}); 

function showScore(){
    //HMI :
    $("#bt-accueil").show();
    $("#bt-instancier").hide();
    $("#row-question").hide();
    
    $("#div-histo").css("backgroung-color", "grey"); //KO !important ??
    $("#row-score").show();

    //Treatment :

    //Calculate the score and display it :
    var score = 0;
    for (i=0;i<instancesTable.length;i++){
        if(instancesTable[i].reponse == instancesTable[i].reponseJoueur) score+=1;
    }
    $("#p-score").html("");
    $("#p-score").text("Votre score est de "+score+" sur "+instancesTable.length); 

    //Display the responses :
    $("#div-histo").html("");
    for(i=0;i<instancesTable.length;i++) instancesTable[i].afficherScore();

    //Nagigation :
    gameOver=true; //=> "Accueil" activ
}

//"Valider" button :
$("#bt-valider").click(function(){ 
    
    alert(questionInProgressNumber);
    instancesTable[questionInProgressNumber].reponseJoueur = $("input:checked").val();

    //Display the next question (or the score if no questions left) :
    questionInProgressNumber+=1;
    if (questionInProgressNumber < instancesTable.length) instancesTable[questionInProgressNumber].createHMI();
    else {
        showScore();   //Disply the score if no questions left.
        questionInProgressNumber=-1;
    }
}); 