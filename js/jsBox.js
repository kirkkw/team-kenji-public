var firstN;
var lastN;
var fieldRet;
var field1;
var field2;
var uid;
var leftSelected;
var rightSelected;
var peid;
var pfn;
var pln;
var username;
var password;
/*** POST FIELDS ****/


var qandcom;
var info1_1;
var info1_2;
var info1_3;
var info1_4;
var info1_5;
var info2_1;
var info2_2;
var info2_3;
var info2_4;
var info2_5;

/*** END POST FIELDS***/

/*******COMMENT COUNTER*****/
var commentCounter;
var userNum = 0;

/**************LOGIN/REG SCRIPTS*********************/

function checkLogin(){

  var loginSucc = false;

  //id can be ID or email
  var uid = document.getElementById("userID").value;
  var pass = document.getElementById("userPass").value;

  if(uid=="" || uid==null || pass=="" || pass==null){
    validate();
  }
  else{ 
    console.log(uid);
    console.log(pass);

    $.getJSON("../compair_a6/json/login.json", function(data){
      console.log(data);
      
      for(var i = 0; i < data.logininfo.length; i++){
        var dataID = data.logininfo[i].userID;
	var dataPass = data.logininfo[i].password;
	var dataEmail = data.logininfo[i].email;
        var dataFirst = data.logininfo[i].firstname;
	var dataLast = data.logininfo[i].lastname;
        var dataNum = data.logininfo[i].userNum;
        
	if( (uid == dataID || uid == dataEmail) && (pass == dataPass)){
          console.log("Found the account!");
	  console.log("UserNum: " + dataNum);
	  loginSuccess(dataID, dataEmail, dataFirst, dataLast, dataPass, dataNum);
	  loginSucc = true;
	  break;
	}
      }
      if(!loginSucc){

        $("#loginErr").fadeIn(400);
        $("#loginErr").fadeOut(900);
        console.log("This username or password is incorrect.");
      }
    });
  }
}

function register(){

  var firstname = document.getElementById("fname").value;
  var lastname = document.getElementById("lname").value;
  var uid = document.getElementById("regID").value;
  var pass = document.getElementById("regPass").value;
  var uemail = document.getElementById("regEmail").value;

  //ONLY MOVE ONTO A NEW PAGE IF WE ACTUALLY GOT A NEW REGISTER.
  var newRegister = true;
  
  if(firstname=="" || firstname==null || lastname=="" || lastname==null || 
  uid=="" || uid==null || pass=="" || pass==null || uemail=="" || uemail==null){
    validate();
  }
  else{
    console.log(firstname);
    console.log(lastname);
    console.log(uid);
    console.log(pass);
    console.log(uemail);

    $.getJSON('../compair_a6/json/login.json', function(data){
      console.log(data);
      //First get the userNum.
      if(data.logininfo[0].userNum != null){
        userNum = parseInt(data.logininfo[0].userNum) + 1;
      }
      else{
        userNum = 0;
      }
      //check to make sure that userID and email are unique.
      for(var i = 0; i < data.logininfo.length; i++){
        var dataID = data.logininfo[i].userID;
	var dataEmail = data.logininfo[i].email;
        
	if(dataID == uid){
          newRegister = false;
	  
	  //CHANGE THIS CONSOLE TO THE ERROR MESSAGE AT BOTTOM OF SCREEN
	  console.log("This username has already been used. Please pick a different one.");

	  if(dataEmail == uemail){


	    $("#regErrBoth").fadeIn(400);
	    $("#regErrBoth").fadeOut(900);
	  }
	  else{

	    $("#regErrUser").fadeIn(400);
	    $("#regErrUser").fadeOut(900);

	  }
	}
	else{
          if(dataEmail == uemail){
            newRegister = false;

	    $("#regErrEmail").fadeIn(400);
	    $("#regErrEmail").fadeOut(900);
	    //CHANGE THIS CONSOLE TO THE ERROR MESSAGE AT BOTTOM OF SCREEN.
	    console.log("This email already exists. Please enter a new one.");
	  }
	}
      }

      if(newRegister){
        //Create json object
        var obj = '{"firstname": "' + firstname + '", "lastname": "' + lastname+ '", "userID": "' + uid + '", "password": "' + pass + '", "email": "' + uemail + '", "userNum": "' + userNum + '"}'

        var jsonObj = JSON.parse(obj);       
	data.logininfo.unshift(jsonObj);  
      
        console.log(data);

        $.ajax({
          type:"POST",
	  url: "inc/register.php",
	  data: {myJSON: data},
	  success: function(mydata){
            console.log("Successfully registered!");
	  },
	  error: function(e){
	    console.log(e);
	  }
        });
     }
    if(newRegister){
      
      registerSuccess();
    }
    });
  }
}

function validate(){
  $("#validateMsg").fadeIn(400);
  $("#validateMsg").fadeOut(900);
}

//need to make failure functions later
function loginSuccess(userName, email, FirstName, LastName, mPassword, myUserNum){

  var form = document.getElementById("login");

  //later on _ wll have login validate function where uid is set
  uid = email;
  firstN = FirstName;
  lastN = LastName;
  peid = email;
  username = userName;
  password = mPassword;
  userNum = myUserNum;
  console.log(uid);
  console.log(firstN);
  console.log(lastN);
  console.log(peid);
  console.log(username);
  console.log(password);
  console.log(userNum);
  form.reset();
  mainPage();
}

function registerSuccess(){
  $("#registerForm").hide();
  $("#validateMsg").hide();
  $("#regResults").fadeIn(400);
  var form = document.getElementById("register");
  form.reset();
}

function changeLogin(){
  var form = document.getElementById('changeAcc');
  
  var newRegID = document.getElementById('newRegID').value;
  var newPassword = document.getElementById('newPassword').value;

  console.log(newRegID);
  console.log(newPassword);
  if( (newRegID == null || newRegID == "") && (newPassword == null || newPassword == "")){
    $("#validateChange").fadeIn(400);
    $("#validateChange").fadeOut(900);
    console.log("No new changes were detected. Nothing was changed.");
    form.reset();
  }
  else{
    $.getJSON("../compair_a6/json/login.json", function(data){
      console.log(data);
      var myLogin;
      var usernameTaken = false;
      //find the entry with the correct login info.
      //first check to make sure username hasn't been taken already.
      for(var i = 0; i < data.logininfo.length; i++){
        var dataUsername = data.logininfo[i].userID;
	if(newRegID == dataUsername){
	  $("#regErrUser").fadeIn(400);
	  $("#regErrUser").fadeOut(900);
          console.log("That username already exists.");
	  usernameTaken = true;
	  break;
	}
      }

      if(!usernameTaken){
        for(var i = 0; i < data.logininfo.length; i++){
          var dFirst = data.logininfo[i].firstname;
	  var dLast = data.logininfo[i].lastname;
	  var dID = data.logininfo[i].userID;
	  var dPass = data.logininfo[i].password;
	  var dEmail = data.logininfo[i].email;

	  if( (firstN == dFirst) && (lastN == dLast) && (username = dID) && (password = dPass) && (peid == dEmail)){
            myLogin = data.logininfo[i];
	    break;
	  }
        }

        if(newRegID != null && newRegID != ""){
          myLogin.userID = newRegID;
	  username = newRegID;
        }
        if(newPassword != null && newPassword != ""){
          myLogin.password = newPassword;
          password = newPassword;
        }

        console.log(data);

        $.ajax({
          type:"POST",
	  url: "inc/register.php",
	  data: {myJSON: data},
	  success: function(mydata){
            console.log("Successfully changed login details.");
	    $("div").hide();
	    $("#accResults").fadeIn(400);
	  },
	  error: function(e){
            console.log(e);
	  }
        });
      }
      form.reset();
    });
  }
}

function openReg(){
  $("#registerForm").fadeIn(400);
  $("#loginMsg").hide();
}

function openLogin(){
  $("#loginForm").fadeIn(400);
  $("#loginMsg").hide();
}

function initBackBtn(){
  $("#loginForm").hide();
  $("#registerForm").hide();
  $("#loginMsg").fadeIn(400);
  $("#validateMsg").hide();
}


function logout(){
  uid = "";
  firstN = "";
  lastN = "";
  peid = "";
  username = "";
  userNum = 0;
  console.log(uid);
  console.log(firstN);
  console.log(lastN);
  console.log(peid);
  console.log(username);
  $("div").hide();
  $("#loginMsg").fadeIn(400);

}

function login(){
  $("div").hide();
  $("#loginForm").fadeIn(400);

}

/************************END LOGIN/REG*******************/

/************************MY ACCOUNT****************/



/***************END MY ACCOUNT***************/
/***************MAIN PAGE*******************/
function mainPage(){
  $("div").hide();
  $(".appended").remove();
  buildPage();
}

function refreshMain(){
  $("div").fadeOut(200);
  buildPage();
}

function buildPage(){
  $.getJSON('../compair_a6/json/mainlist.json', function(data){

    console.log(data);
    var searches = data.myhistory.map(function(result){
      //find globals _ this is where you check with the globals that have been set already
      var tempUid = result.id;
      var tempfirstN = result.firstname;
      var templastN = result.lastname;
      if(tempUid == uid){

//	firstN = tempfirstN;
//	lastN = templastN;

        var rid=result.id;
	var rf1=result.field1;
	var rf2=result.field2;
        var rfn=result.firstname;
	var rln=result.lastname;
        console.log(uid + " _ " + firstN + " - " + lastN);
        return "<span class='hoverable' onclick='findPost(this)' resfn='"+rfn
	+"' resln='"+rln+"' resid='"+rid+"' resf1='"+rf1+"' resf2='"+rf2+"'>"+
	result.firstname + " " + result.lastname + ": <b>"+result.field1+"</b> VS <b>"+result.field2+
	"</b></span><button class='miniBtn' type='button' onclick='deleteConfirm(this);'"
	+"resid='"+rid+"' resf1='"+rf1+"' resf2='"+rf2+"'>Delete</button>";
      }
    });
   
    var gSearches = data.globalhistory.map(function(result){
      var tempUid = result.id;
      var tempFirstN = result.firstname;
      var templastN = result.lastname;
      
      var rid=result.id;
      var rf1=result.field1;
      var rf2=result.field2;
      var rfn=result.firstname;
      var rln=result.lastname;
      return "<span class='hoverable' onclick='findPost(this)' resid='"+rid+"' resf1='"+rf1
      +"' resfn='"+rfn+"' resln='"+rln+"' resf2='"+rf2+"'>"+
      result.firstname + " " + result.lastname + ": <b>"+result.field1+"</b> VS <b>"+result.field2+"</b>";
    });

    var mylist = '<p>' + searches.join('</p><p>') + '</p>';
    $('#myresults').html(mylist);

    var gList = '<p>' + gSearches.join('</p><p>') + '</p>';
    $('#globalresults').html(gList);
    
    $('#myNameHeader').html(firstN + " " + lastN + " (" + userNum + ")");
  }).then(function(){
  
    $("#mainPage").fadeIn(400);
  
  });


}

function deleteConfirm(element){
  var modal=document.getElementById('del-modal');
  modal.style.setProperty("display", "block", "important");
  document.getElementById('yesbtn').onclick = function(){
    deletePost(element);
    deleteModal();
  }
}

function deleteModal(){
  var modal=document.getElementById('del-modal');
  modal.style.setProperty("display", "none", "important");
}

function deletePost(element){

  var id = element.getAttribute("resid");
  var resf1 = element.getAttribute("resf1");
  var resf2 = element.getAttribute("resf2");
    console.log("Deleting");
    //Get the JSON data from mainlist, then delete the selected entry.
    $.getJSON('../compair_a6/json/mainlist.json', function(data){
      console.log("Getting mainlist.json");
      console.log(data);
      
      //We will loop through the given JSON files, to find the one to delete.
      //First is myhistory.
      for(var i = 0; i < data.myhistory.length; i++){
        console.log(data.myhistory[i]);
	var currData = data.myhistory[i];
	if((currData.id == id) && (currData.field1 == resf1) && (currData.field2 == resf2) ){
          console.log("Found a match!");
	  data.myhistory.splice(i, 1);
	  break;
	}
      }
      console.log(data);

      //Now we do global history.
      for(var i = 0; i < data.globalhistory.length; i++){
        console.log(data.globalhistory[i]);
	var currData = data.globalhistory[i];
	if((currData.id == id) && (currData.field1 == resf1) && (currData.field2 == resf2) ){
          console.log("Found a match!");
	  data.globalhistory.splice(i, 1);
	  break;
	}
      }
      console.log(data);

      //With the new data, we will send this to the php file.
      $.ajax({
        type:"POST",
	url: "inc/deletejsonhist.php",
	data: {myJSON: data},
	success: function(mydata){
          console.log("success!");
	},
	error: function(e){
          console.log(e);
	}
      });

    }).then(function(){

    //Get the JSON data from resultslist, then delete the selected entry.
    $.getJSON('../compair_a6/json/resultslist.json', function(data){
      console.log("Getting resultslist.json");
      console.log(data);
      
      //We will loop through the given JSON files, to find the one to delete.     
        for(var i = 0; i < data.postList.length; i++){
        console.log(data.postList[i]);
	var currData = data.postList[i];
	if((currData.peid == id) && (currData.field1 == resf1) && (currData.field2 == resf2) ){
          console.log("Found a match!");
	  data.postList.splice(i, 1);
	  break;
	}
      }
      console.log(data);

      //With the new data, we will send this to the php file.
      $.ajax({
        type:"POST",
	url: "inc/deletejsonresults.php",
	data: {myJSON: data},
	success: function(mydata){
          console.log("success!");
	},
	error: function(e){
          console.log(e);
	}
      });

    }).then(function(){
      console.log("Tyler Lands");
      deleteEntry(element);

    });
  }); 

}



function myAcc(){
  $("div").hide();
  $("#myAccount").fadeIn(400);
}
/********************END MAIN PAGE***************/
/****************COMPARISON LIST*************/


function refreshLists(){

  $("div").fadeOut(200);
  rightSelected = null;
  leftSelected = null;
  resetPre();
  buildList();

}

function compareList(){
  console.log("username is: " + username); 
  //reset globals
  rightSelected = null;
  leftSelected = null;
  $("div").hide();
  resetPre();
  buildList();
}

function addFieldSender(){
  $("div").hide();
  $("#newField").fadeIn(400);
  $("#fieldForm").fadeIn(400);
  $("#fieldSuccess").hide()
}

function buildList(){
  $(".appended").remove();
  $.getJSON('json/fieldlist.json', function(data){

    var listLeft = data.careerfield.map(function(result){

      return "<td class='leftList hoverable' onclick='leftLighter(this);'>" + result.fieldName + "</td>";
    });
   
    var listRight = data.careerfield.map(function(result){

      return "<td class='rightList hoverable' onclick='rightLighter(this);'>" + result.fieldName + "</td>";
    });

    var myLeft = '<tr>' + listLeft.join('</tr>');
    $('#tableListLeft').html(myLeft);

    var myRight = '<tr>' + listRight.join('</tr>');
    $('#tableListRight').html(myRight);


  }).then(function(){
  
  
    $("#compareList").fadeIn(400);
  });

}

function leftLighter(element){
  $(".leftList").css("background-color", "#f9f2ec");
  element.style.backgroundColor="#ffe0b5";
  
  leftSelected = $(element).html();
  console.log("Left Value is " + leftSelected);

}

function rightLighter(element){
  $(".rightList").css("background-color", "#f9f2ec");
  element.style.backgroundColor="#ffe0b5";
  
  rightSelected = $(element).html();
  console.log("Right Value is " + rightSelected);

}


/***************8ADD BUTTON**********************/



function addField(){
  $("#validateField").hide();
  $("#validateMsg").hide();
  //checks for validation
  var check1 = true;
  var check2 = true;

  var fieldname = document.getElementById("fieldName").value;
  if(fieldname == "" || fieldname == null){
    $("#validateMsg").fadeIn(400);
    $("#validateMsg").fadeOut(400);
    check1 = false;
  }
  
  //if exists check
  fieldValidation(fieldname, check1);

}

function fieldValidation(fieldname, check1){

  $.getJSON('json/fieldlist.json', function(data){

    var list = data.careerfield.map(function(result){
      
      if(result.fieldName == fieldname){
        $("#validateField").fadeIn(400);
        fieldRet = false;

      }
    });
  }).then(function(){ 
    
      if(fieldRet !== false){
        fieldRet = true;
        callbackFieldVal(fieldname, fieldRet, check1);
      }
      else{
        callbackFieldVal(fieldname, fieldRet, check1);
      }
    });
  
}

function callbackFieldVal(fieldname, check2, check1){

  fieldRet= true;
  //if false, dont do anything, but if true keep going
  if((check2 !== false  && check1 !==false)){

    var JSONobject = '{ "fieldName": "'+fieldname+ '"}';
    var obj = JSON.parse(JSONobject);
    console.log(obj);
    $.getJSON('json/fieldlist.json', function(data){
      console.log(data);
      data.careerfield.unshift(obj);
      $.ajax({
        type:"POST",
	url: "inc/addfield.php",
	data: {myJSON: data},
	success: function(mydata){
          console.log("Success!");

	},
	error: function(e){
          console.log(e);
	}

      }).then(function(){
      
	  $("#fieldForm").hide();
	  $("#fieldSuccess").fadeIn(400);
          var form = document.getElementById("fieldInputForm");
          form.reset();
	  $("#validateField").hide();
      });
    });
  }
}
/********************END ADD BTN**************/

function validateLists(){
  var listRet =true;
  $("#validateListMsg").hide();
  $("#validateField").hide();

  if(rightSelected == "" || rightSelected == null || leftSelected == null
  || leftSelected == "" || rightSelected == leftSelected){
    $("#validateListMsg").fadeIn(400);    
    listRet = false;
    return false;
  }
  else{
  
  
  $.getJSON('json/mainlist.json', function(data){

    var list = data.myhistory.map(function(result){
      
      if(result.id == uid && result.field1 == leftSelected && result.field2 == rightSelected){
        $("#validateField").fadeIn(400);
        listRet=false;
      }
    });
  }).then(function(){ 
    
    callbackListWriter(listRet);
  
  });
 }

}

//writing fields for mainpage
function writeFields(){
  
  
  console.log(rightSelected+leftSelected);
  
  var JSONobject = '{ "id": "' + uid  + '", "firstname": "' + firstN + '", "lastname": "'
  + lastN + '", "field1": "' + leftSelected + '", "field2": "' + rightSelected+ '"}';

  var obj = JSON.parse(JSONobject);
  console.log(obj);

  $.getJSON('json/mainlist.json', function(data){
    console.log(data);
    data.myhistory.unshift(obj);
    data.globalhistory.unshift(obj);
    console.log(data);
    $.ajax({
      type:"POST",
      url: "inc/writejson.php",
      data: {myJSON: data},
      success: function(mydata){
        console.log("success!");
      },
      error: function(e){
        console.log(e);
      }


    });



  }).then(function(){
  
      console.log("Writing finished");
      console.log("Writing finished");
      console.log("Writing finished");
      retrievePre();
      populateRes();
//compareResultsPOST follow up callbacks
      writePost();
  });
}

/*************END COMPARISON LIST************/
/************COMPARISON RESULTS********************/

function refreshRes(){

  $(".appended").remove();
  populateRes();
  openComments();

}

function editForm(){
  $("div").hide();
  setEdits();
  
  $("#preField3").append("<span class='appended'><b>"+field1+"</b></span>");
  $("#preField4").append("<span class='appended'><b>"+field2+"</b></span>");
  $("#editHead").append("<span class='appended'><b>"+field1+"</b> and <b>"+field2+"</b></span>");
  $("#compareResultsEDIT").fadeIn(400);
}
function backToRes(){
  $("#compareResultsEDIT").hide();
  $("#compareResultsPOST").fadeIn(400);

  var form = document.getElementById("editForm");
  form.reset();
}

function setEdits(){
  $("#editquestions").val(qandcom);
  $("#editField1_1").val(info1_1);
  $("#editField1_2").val(info1_2);
  $("#editField1_3").val(info1_3);
  $("#editField1_4").val(info1_4);
  $("#editField1_5").val(info1_5);
  $("#editField2_1").val(info2_1);
  $("#editField2_2").val(info2_2);
  $("#editField2_3").val(info2_3);
  $("#editField2_4").val(info2_4);
  $("#editField2_5").val(info2_5);

}
function saveRes(){
  $("#editSave").fadeIn(400);
  $("#editSave").fadeOut(2000);
  $(".appended").remove();
  retrieveEdits();
  populateRes();
  writeEdits();
}

function writeEdits(){

  var JSONobject = '{ "peid": "' + uid  + 
  '", "question": "' + qandcom
  + '", "in1_1": "'+ info1_1
  + '", "in1_2": "'+ info1_2
  + '", "in1_3": "'+ info1_3
  + '", "in1_4": "'+ info1_4
  + '", "in1_5": "'+ info1_5
  + '", "in2_1": "'+ info2_1
  + '", "in2_2": "'+ info2_2
  + '", "in2_3": "'+ info2_3
  + '", "in2_4": "'+ info2_4
  + '", "in2_5": "'+ info2_5
  + '", "field1": "'+ leftSelected
  + '", "field2": "'+ rightSelected
  + '"}';

  var obj = JSON.parse(JSONobject);

  $.getJSON('json/resultslist.json', function(data){
    

    //first delete, then add back
    for(var i =0;i<data.postList.length;i++){
      var currData = data.postList[i];

      if((currData.peid == peid) && (currData.field1 == leftSelected) && (currData.field2 == rightSelected)){
        
	console.log("Found post... splicing...");
        data.postList.splice(i,1);
      }
    }
    
    $.ajax({
      type:"POST",
      url: "inc/deletejsonresults.php",
      data: {myJSON: data},
      success: function(mydata){
        console.log("Going through");
      },
      error: function(e){
        console.log(e);
      }
    }).then(function(){
      data.postList.unshift(obj);
    
      $.ajax({
        type:"POST",
        url: "inc/writepost.php",
        data: {myJSON: data},
        success: function(mydata){
          console.log("successfully added new instance");
        },
        error: function(e){
          console.log(e);
        }
    

      });
    });
    
  }).then(function(){

    openComments();
    refreshRes();
  });
  
}
function compareResults(){
  
  var check = validateLists();

}

function callbackListWriter(check){


  if(check){
    $("div").hide();
    $("#compareResultsPRE").fadeIn(400);

    field1 = leftSelected;
    field2 = rightSelected;


    $("#resultsMsg").append("<span class='appended'><b> "+field1+"</b> and <b>"+field2+"</b></span>");

    $("#preField1").append("<span class='appended'><b>"+field1+"</b></span>");
    $("#preField2").append("<span class='appended'><b>"+field2+"</b></span>");
    

  }


}

function compareResultsPOST(){

    
  peid=uid;
  writeFields();

}

function populateRes(){
  $("#mainCompare").append("<span class='appended'><b> "+field1+"</b> and <b>"+field2+"</b></span>");
  $("#authorCheck").append("<span class='appended'><b> "+pfn+" "+pln+" </b></span>"); 
  $("#leftRes").append("<span class='appended'><b>"+field1+"</b></span>");
  $("#rightRes").append("<span class='appended'><b>"+field2+"</b></span>");
  
  if(uid == peid) $("#editChecker").append(
  "<button id='editFormBtn' onclick='editForm();' class='editBtn appended'>Edit Questions/Details</button>"
  );
  if(qandcom !== "" && qandcom !== null){
    $("#uinput").append("<span class='appended'><b>User Questions/Comments: </b>"+qandcom+"</span>");
  } else $("#uinput").append(
  "<span class='appended' onclick='addQ();'><b>No particular user questions/comments</b></span>");
  
  popleft();
  popright();

}
/////GETE BACK TO THIS LATER
//
//writing post for mainpage and main functionality
function writePost(){

  var JSONobject = '{ "peid": "' + uid  + 
  '", "question": "' + qandcom
  + '", "in1_1": "'+ info1_1
  + '", "in1_2": "'+ info1_2
  + '", "in1_3": "'+ info1_3
  + '", "in1_4": "'+ info1_4
  + '", "in1_5": "'+ info1_5
  + '", "in2_1": "'+ info2_1
  + '", "in2_2": "'+ info2_2
  + '", "in2_3": "'+ info2_3
  + '", "in2_4": "'+ info2_4
  + '", "in2_5": "'+ info2_5
  + '", "field1": "'+ leftSelected
  + '", "field2": "'+ rightSelected
  + '"}';

  var obj = JSON.parse(JSONobject);

  $.getJSON('json/resultslist.json', function(data){
    
    data.postList.unshift(obj);
    
    $.ajax({
      type:"POST",
      url: "inc/writepost.php",
      data: {myJSON: data},
      success: function(mydata){
        console.log("success!");
      },
      error: function(e){
        console.log(e);
      }


    });
  }).then(function(){
  
  
      //CONTINUE CALLBACK compareResultsPOST

      createPost();

    
  });
}
function popleft(){


  var check = 0;
  if(info1_1 !== "" && info1_1 !== null){
    $("#initInfoLeft").append("<span class='appended'><br>"+info1_1+"</span>");
    check=1;
  }
  if(info1_2 !== "" && info1_2 !== null){
    $("#initInfoLeft").append("<span class='appended'><br>"+info1_2+"</span>");
    check=1;
  }
  if(info1_3 !== "" && info1_3 !== null){
    $("#initInfoLeft").append("<span class='appended'><br>"+info1_3+"</span>");
    check=1;
  }
  if(info1_4 !== "" && info1_4 !== null){
    $("#initInfoLeft").append("<span class='appended'><br>"+info1_4+"</span>");
    check=1;
  }

  if(info1_5 !== "" && info1_5 !== null){
    $("#initInfoLeft").append("<span class='appended'><br>"+info1_5+"</span>");
    check=1;
  }
  if(check == 0){
    $("#initInfoLeft").append("<span class='appended'><br> No Details Provided </span>");
  }

}

function popright(){

  var check =0
  if(info2_1 !== "" && info2_1 !== null){
    $("#initInfoRight").append("<span class='appended'><br>"+info2_1+"</span>");
    check=1;
  }
  if(info2_2 !== "" && info2_2 !== null){
    $("#initInfoRight").append("<span class='appended'><br>"+info2_2+"</span>");
    check=1;
  }
  if(info2_3 !== "" && info2_3 !== null){
    $("#initInfoRight").append("<span class='appended'><br>"+info2_3+"</span>");
    check=1;

  }
  if(info2_4 !== "" && info2_4 !== null){
    $("#initInfoRight").append("<span class='appended'><br>"+info2_4+"</span>");
    check=1;
  }
  if(info2_5 !== "" && info2_5 !== null){
    $("#initInfoRight").append("<span class='appended'><br>"+info2_5+"</span>");
    check=1;
  }
  
  if(check == 0){
    $("#initInfoRight").append("<span class='appended'><br> No Details Provided </span>");
  }
}

function addQ(){
//if puid = uid allow
//else message saying no

}
function addInfo(){
//if puid = uid allow
//else message saying no

}
function retrieveEdits(){

  qandcom = document.getElementById("editquestions").value;
  info1_1 = document.getElementById("editField1_1").value;
  info1_2 = document.getElementById("editField1_2").value;
  info1_3 = document.getElementById("editField1_3").value;
  info1_4 = document.getElementById("editField1_4").value;
  info1_5 = document.getElementById("editField1_5").value;
  info2_1 = document.getElementById("editField2_1").value;
  info2_2 = document.getElementById("editField2_2").value;
  info2_3 = document.getElementById("editField2_3").value;
  info2_4 = document.getElementById("editField2_4").value;
  info2_5 = document.getElementById("editField2_5").value;


}
function retrievePre(){

  qandcom = document.getElementById("questions").value;
  info1_1 = document.getElementById("infoField1_1").value;
  info1_2 = document.getElementById("infoField1_2").value;
  info1_3 = document.getElementById("infoField1_3").value;
  info1_4 = document.getElementById("infoField1_4").value;
  info1_5 = document.getElementById("infoField1_5").value;
  info2_1 = document.getElementById("infoField2_1").value;
  info2_2 = document.getElementById("infoField2_2").value;
  info2_3 = document.getElementById("infoField2_3").value;
  info2_4 = document.getElementById("infoField2_4").value;
  info2_5 = document.getElementById("infoField2_5").value;
  pfn = firstN;
  pln = lastN;
}

function resetPre(){
  
  qandcom = "";

  info1_1 = "";
  info1_2 = "";
  info1_3 = "";
  info1_4 = "";
  info1_5 = "";
  info2_1 = "";
  info2_2 = "";
  info2_3 = "";
  info2_4 = "";
  info2_5 = "";

  var form = document.getElementById("infoForm");
  form.reset();
}



/********************************************************FIND POST****************************/
function findPost(element){
  $(".appended").remove();
  console.log(username + " is the username");
  console.log(element.getAttribute("resid"));
  console.log(element.getAttribute("resf1"));
  console.log(element.getAttribute("resf2"));
  
  var rfn = element.getAttribute("resfn");
  var rln = element.getAttribute("resln");
  var rid = element.getAttribute("resid");
  var rf1 = element.getAttribute("resf1");
  var rf2 = element.getAttribute("resf2");

  console.log(rfn+rln);
  $("div").hide();
  retrieveData(rid, rf1, rf2, rfn, rln);
}

function retrieveData(rid, rf1, rf2, rfn, rln){

  $.getJSON('json/resultslist.json', function(data){
    

    //first delete, then add back
    for(var i =0;i<data.postList.length;i++){
      var currData = data.postList[i];

      if((currData.peid == rid) && (currData.field1 == rf1) && (currData.field2 == rf2)){
        console.log("Found Data... Retrieving...");
        qandcom=currData.question;
	info1_1=currData.in1_1;
	info1_2=currData.in1_2;
	info1_3=currData.in1_3;
	info1_4=currData.in1_4;
	info1_5=currData.in1_5;
	info2_1=currData.in2_1;
	info2_2=currData.in2_2;
	info2_3=currData.in2_3;
	info2_4=currData.in2_4;
	info2_5=currData.in2_5;
	leftSelected = rf1;
	rightSelected = rf2;
	field1 =rf1;
	field2=rf2;
        peid = rid;
        pfn = rfn;
	pln = rln;

	break;

      }
    }
    
  }).then(function(){
    populateRes();
    openComments();   



  });


}

/*****************END COMPARISON RESULTS**********/



/*******TESTING FIELD********/

function testGlobal(){
  console.log(uid);
  console.log(firstN);
  console.log(lastN);

}

/*****END TESTING FIELD******/
/*********************************COMMMENTS************/


function openComments(){
  $.getJSON('../compair_a6/json/comments.json', function(data){
    console.log("MY PEID IS: " + uid);
    console.log("UserNum is :" + userNum);
    var commentArray = "";
    for(var i =0;i<data.postBook.length; i++){
      var pField1 = data.postBook[i].field1;
      var pField2 = data.postBook[i].field2;
      var pemailid = data.postBook[i].postID;
      
      if( (pemailid === peid) && (pField1 == field1) && (pField2 == field2) ){
        console.log("PREFOUND");
	commentArray = data.postBook[i].postComment;
	break;
      }
    }


    console.log(peid==pemailid);
    console.log("'"+peid+"'"+"'"+pemailid+"'");
     
    if(commentArray !== ""){
      commentCounter = commentArray[0].commentID;
      console.log("OPENCOMMENTS: Comment counter is " + commentCounter);
      var leftComments = commentArray.map(function(result){
        if(result.side == "left"){
 return '<td class="appended hoverable" data-id="' + result.commentID + '" data-com="' + result.userComment + '" data-side="left" onclick="commentModal(this);">' + result.userID + ': ' + result.userComment + '</td>';
 
        }
      });

      var rightComments = commentArray.map(function(result){
        if(result.side == "right"){
return '<td class="appended hoverable" data-id="' + result.commentID + '" data-value="' + result.userComment + '" data-side="right" onclick="commentModal(this);">' + result.userID + ': ' + result.userComment + '</td>';

        }
      });
      var myLeftComments = '<tr>'+leftComments.join('</tr>');
      $('#resultsLeft').html(myLeftComments);

      var myRightComments = '<tr>'+rightComments.join('</tr>');
      $('#resultsRight').html(myRightComments);
    }
    else{
      //donothing
    }
  }).then(function(){
    doubleCheck();
  });

}
function doubleCheck(){


  $.getJSON('../compair_a6/json/comments.json', function(data){
    var commentArray = "";
    for(var i =0;i<data.postBook.length; i++){
      var pField1 = data.postBook[i].field1;
      var pField2 = data.postBook[i].field2;
      var pemid = data.postBook[i].postID;
      
      if( (peid == pemid) && (pField1 == field1) && (pField2 == field2) ){
        commentArray = data.postBook[i].postComment;
	break;
      }
    }
    
    if(commentArray !== ""){
      commentCounter = commentArray[0].commentID;
      console.log("DOUBLECHECK: Comment Counter is " + commentCounter);
      var leftComments = commentArray.map(function(result){
        if(result.side == "left"){
 return '<td class="appended hoverable" data-id="' + result.commentID + '" data-com="' + result.userComment + '" data-side="left" onclick="commentModal(this);">' + result.userID + ': ' + result.userComment + '</td>';
 
        }
      });

      var rightComments = commentArray.map(function(result){
        if(result.side == "right"){
return '<td class="appended hoverable" data-id="' + result.commentID + '" data-value="' + result.userComment + '" data-side="right" onclick="commentModal(this);">' + result.userID + ': ' + result.userComment + '</td>';

        }
      });
      var myLeftComments = '<tr>'+leftComments.join('</tr>');
      $('#resultsLeft').html(myLeftComments);

      var myRightComments = '<tr>'+rightComments.join('</tr>');
      $('#resultsRight').html(myRightComments);
    }
    else{
      //donothing
    }
  }).then(function(){

    $("#compareResultsEDIT").hide();
    $("#compareResultsPOST").fadeOut(200);
    $("#compareResultsPOST").fadeIn(400);
    
    

    $("#leftComment").val("");
    $("#rightComment").val("");
  });
}

function addComment(element){
  var side = element.getAttribute('data-value');
  var comment = "";
  console.log("userNum is: " + userNum);
  console.log("ADDCOMMENT: Comment Counter is " +commentCounter);
  commentCounter++;
  console.log("ADDCOMMENT: Comment Counter is now " +commentCounter);
  if(side=="left"){
    comment = document.getElementById('leftComment');
  } else {
    comment = document.getElementById('rightComment');
  }

  if(comment.value == ""){
    $("#commentErr").fadeIn(400);
    $("#commentErr").fadeOut(2000);
  } else{

    var obj='{"peid": "' + uid + '", "userComment": "'+comment.value+'", "userID": "'+firstN + ' '+lastN+ ' (' + userNum+ ')", "side": "'+side+'", "commentID": "'+commentCounter+'" }';
    var jsonobj = JSON.parse(obj);
    $.getJSON('../compair_a6/json/comments.json', function(data){
      for(var i=0;i<data.postBook.length;i++){
        var pField1 = data.postBook[i].field1;
	var pField2 = data.postBook[i].field2;
        
	if((pField1 == field1) && (pField2 == field2)){
          data.postBook[i].postComment.unshift(jsonobj);
	  break;
	}
      }
      console.log(data);
      $.ajax({
        type:"POST",
	url:"inc/updatecomments.php",
	data: {myJSON: data},
	success:function(mydata){
          console.log("Comment Added!");
	},
	error: function(e){
	  console.log(e);
	}

      });
    }).then(function(){
      
      $("#commentAdd").fadeIn(400);
      $("#commentAdd").fadeOut(1000)
      openComments();
    });

  }

}

function createPost(){
  $.getJSON("../compair_a6/json/comments.json", function(data){
  
    var obj='{"postID": "'+uid+'", "field1": "'+leftSelected+'", "field2": "'+rightSelected+'", "postComment":[{"userComment": "", "peid": "", "userId": "", "side": "", "commentID": ""}]}';
    commentCounter = 0;
    var jsonobj=JSON.parse(obj);
    data.postBook.unshift(jsonobj);
    $.ajax({
      type:"POST",
      url: "inc/updatecomments.php",
      data: {myJSON: data},
      success: function(mydata){
        console.log("Creation Success");


   console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
      },
      error: function(e){
        console.log(e);

   console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2");
      }
 
    });

  }).then(function(){

  
      $("div").hide();
      $("#compareResultsPOST").fadeIn(400);
  });


}

function deleteEntry(element){
  $.getJSON("../compair_a6/json/comments.json", function(data){
    console.log("In delete entry");
    console.log(data);
    var id = element.getAttribute("resid");
    var resf1 = element.getAttribute("resf1");
    var resf2 = element.getAttribute("resf2");
    for(var i=0; i<data.postBook.length;i++){
      var pID = data.postBook[i].postID;
      var pField1 = data.postBook[i].field1;
      var pField2 = data.postBook[i].field2;
      console.log(pID + " vs " + uid);
      console.log(pField1 + " vs " + resf1);
      console.log(pField2 + " vs " + resf2);
      if((pID==uid) && (pField1 == resf1) && (pField2 = resf2)){
        console.log("Found a match!");
	data.postBook.splice(i,1);
	break;
      }
    }
    console.log(data);
    $.ajax({
      type:"POST",
      url: "inc/updatecomments.php",
      data: {myJSON: data},
      success: function(mydata){
        console.log("Post Deleted");
      },
      error: function(e){
        console.log(e);
      }
 

    });
  }).then(function(){
  
  
      refreshMain();   

      $("#deleteSuccess").fadeIn();
      $("#deleteSuccess").fadeOut(2000);
  });

}
/***STRETCH METHOD****/

function deleteComment(element){
  var commentID = element.getAttribute('data-id');
  $.getJSON("../compair_a6/json/comments.json", function(data){
    var checker = false;
    var dataComment ="";
    for (var i=0;i<data.postBook.length;i++){
      var pField1 = data.postBook[i].field1;
      var pField2 = data.postBook[i].field2;

      console.log(data.postBook[i].postID);
      if((pField1 ==field1) && (pField2==field2)){
        dataComment = data.postBook[i].postComment;
        console.log("DELETECOMMENT: FOUND THE ARRAY!");
        break;
      }
    }
      if(dataComment !== ""){
        for(var i=0;i<dataComment.length;i++){
          console.log("Inside");
  	  console.log(i + " vs " + dataComment.length);
	  var myPeid = dataComment[i].peid;
	  var myName = dataComment[i].userID;
	  var cID  = dataComment[i].commentID;
	  if( (uid == myPeid) && (cID == commentID)){
	    console.log("Found a match!");
	    dataComment.splice(i, 1);

    $("#commentDelSuc").fadeIn(400);
    $("#commentDelSuc").fadeOut(1000);
    checker=true;
	    break;
	  }
        }
	if(checker ==false){
          $("#commentDel").fadeIn(400);
	  $("#commentDel").fadeOut(1000);
	}

      }
      $.ajax({
        type:"POST",
        url:"inc/updatecomments.php",
        data: {myJSON: data},
        success:function(mydata){
      	  console.log("Passed through");
        },
        error: function(e){
          console.log(e);
       }
 

      });
    }).then(function(){
  
    openComments();

    deleteComModal();

  });


}

function commentModal(element){
    var modal=document.getElementById('del-com-modal');
    modal.style.setProperty("display", "block", "important");
    document.getElementById('yes-com-btn').onclick=function(){
     deleteComment(element);
     deleteComModal();
    }

  //Future comment Deleter
}
function deleteComModal(){
  var modal= document.getElementById('del-com-modal');
  modal.style.setProperty("display", "none", "important");

}

/********************END COMMENTS*****************/
