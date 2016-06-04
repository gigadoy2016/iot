

class lightLED{
  constructor (id){
    this.id     = id;
    this.status = 0;
  }
  on(){
    this.status = 1;
  }
  off(){
    this.status = 0;
  }
  switching(){
    if(this.status ==0 ) this.status =1;
    else this.status =0;
  }
}
