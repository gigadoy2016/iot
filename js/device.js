//===========================================================
// class    : Relay controller component
// Date     : 22-08-2016
// version  : 0.1
//============================================================

class RelayComponent{

  constructor(id){
    this.ID = id;
    this.STATUS = false;
    this.DETAIL = null;
    this.LOG = [];
    this.CONDITION =[];

    if (id !== null && id !== undefined) {      
      this.node = document.getElementById(id).innerHTML =this.genHTML(this);
      this.init();
    }else{
      console.log('* justgage: Make sure to pass the existing element id or parentNode to the constructor.');
      return false;
    }

    
  }

  init(){
    var obj = this;
    
    // interface event click ON
    document.getElementById(this.ID+'_on').onclick = function(){obj.ON();};
  
    // interface event click OFF
    document.getElementById(this.ID+'_off').onclick = function(){obj.OFF();};

    document.getElementById(this.ID+'_config').onclick = function(){obj.showConfigCondition()};

    document.getElementById(this.ID+'_addCon').onclick = function(){obj.addConditon()};
    
    this.getLogCondition();
  }

  ON(){
    document.getElementById(this.ID+'_on').className ="btn btn-primary";
    document.getElementById(this.ID+'_off').className ="btn btn-default";
    let text = "- [ON] "+$.datepicker.formatDate('dd/mm/yy',new Date())+" "+
      today.getHours()+":"+checkTime(today.getMinutes())+":"+checkTime(today.getSeconds());
    this.getLog(text);
    return this.STATUS = true;
  }

  OFF(){
    document.getElementById(this.ID+'_on').className ="btn btn-default";
    document.getElementById(this.ID+'_off').className ="btn btn-primary";
    let text = "- [OFF] "+$.datepicker.formatDate('dd/mm/yy',new Date())+" "+
      today.getHours()+":"+checkTime(today.getMinutes())+":"+checkTime(today.getSeconds());
    this.getLog(text);
    return this.STATUS = false;
  }

  setStatus(status){
    this.STATUS = status;
    if(status){
      this.ON();
    }else{
      this.OFF();
    }
  }

  getLog(text){
    var LOG = this.LOG;
    LOG.push(text); LOG.reverse();
    let txtLog ="";
    for(let i = 0; LOG.length>i; i++){
      txtLog += '<div class="logController '+ (i <=0 ?'logController-frist':'')+' " >'+LOG[i]+'</div>';
    }
    document.getElementById('controller-log-'+this.ID).innerHTML = txtLog;
  }
  // Display Condition.
  getLogCondition(){
    let obj = this;
    let conditions = this.CONDITION;
    let txt='';

    //console.log(conditions);
    if(conditions.length >0){
      for(var con of conditions){
        let displayStatus = con.status?'ON':'OFF';

        txt +='<div class="logController" id="'+con.ID+'">';
          txt +='<label class="ctrl-con">'+sensors[con.sensorID].name+" "+ con.operator+' '+con.value+'</label>';
          txt +='<label class="ctrl-status">'+displayStatus+'</label>';
        txt +='</div>';
      }
      document.getElementById('ctrl-condition-'+this.ID).innerHTML= txt;

      for(let i=0;conditions.length >i ; i++)
        document.getElementById(conditions[i].ID).onclick =  function(){obj.deleteCon(i);}; 
    }else{
      document.getElementById('ctrl-condition-'+this.ID).innerHTML= '';
    }


  }

  genHTML(){
    let id = this.ID;

    let optionSensor = '';
    for(let i=0; sensors.length > i ;i++){
      optionSensor += `<option value="${i}" class="${sensors[i].type}" >${sensors[i].name}</option>`;
    }


    var text =`
          <button type="button" id="${this.ID}_on" class="btn btn-default">ON</button>
          <button type="button" id="${this.ID}_off" class="btn btn-default">OFF</button>
          <button type="button" id="${this.ID}_config" class="device-config"><img src="css/icons/cog.png"/></button>
        <div class="col-xs-12 controller-device-status" id="${this.ID}_detail">
          <!-- ----------------------- condition ----------------------- -->
          <div>
            <label style="font-weight:bold">[condition]</label>
            <p class="controller-log" id="ctrl-condition-${this.ID}" ></p>
          </div>
          <hr class="ctrl"/>
          <div>
            <p class="controller-log-2" id="controller-log-${this.ID}">
          </div>
        </div>

        <!-- Dialog configuration -->
        <div id="ctrl-control-${this.ID}" style="display:none">

          <fieldset>
            <label for="selectSensor">Select a sensor</label>
            <select name="selectSensor" id="selectSensor-${this.ID}"> ${optionSensor} </select>
            <br/>
            <select name="selectOperator" id="selectOperator-${this.ID}">
              <option class="operator" value=">" > > </option>
              <option class="operator" value="=" > = </option>
              <option class="operator" value="<" > < </option>
            </select>
            <input type="text" class="limitSensor" value="0" id="limitSensor-${this.ID}"/>
            <br/>
            <div>
              <!-- Rounded switch -->
              <label>OFF</label>
              <label class="switch"><input type="checkbox" checked id="${this.ID}_OnOff" ><div class="slider round"></div></label>
              <label>ON</label>
            </div>
            <br/>
            <button id="${this.ID}_addCon">ADD</button>
          </fieldset>
        </div>
        `;
    return text;
  }

// ---------------------------------- Dialog ------------------------------------

  showConfigCondition(){
    let id ='#ctrl-control-'+this.ID;

    $(id).dialog({
        modal:true,
        width:500,
        height:300,
        title:'"'+this.ID +'"'+ " Configuration."
    });
  }

  addConditon(){
    let dialog_id ='#ctrl-control-'+this.ID;

    let id      =document.getElementById(`selectSensor-${this.ID}`).value;
    let oper    =document.getElementById(`selectOperator-${this.ID}`).value;
    let val     =document.getElementById(`limitSensor-${this.ID}`).value;
    let status  =document.getElementById(`${this.ID}_OnOff`).checked;

    if(this.CONDITION.length < 3){
      this.addCon(id,oper,val,status);
      $(dialog_id).dialog("close");  
    }else{
      alert("Can not over 3 conditions.");
    }
    
    //console.log(this.CONDITION);
  }

  addCon(id,oper,val,stat){
    let con = {
      ID        :this.ID+"_"+this.CONDITION.length,
      sensorID  :id,
      operator  :oper,
      value     :val,
      status    :stat
    }
    this.CONDITION.push(con);
    this.getLogCondition();
  }

  deleteCon(id){
    var r = confirm("Delete recond?");
    if (r == true) {
      this.CONDITION.splice(id,1);
      this.getLogCondition();
    } 
  }

//-------------------------------------------------------------------------------
}
//================= End Class Device ============================================
