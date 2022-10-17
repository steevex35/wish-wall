import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Peer } from "peerjs";
@autoinject

export class display_messages{
  private message:string;
  private peer = new Peer("oneTec-wishWall-db-messages-receiver-id");
  private allMessages;
  private all10Messages;
  
  constructor(private router:Router){
    this.startListening()
  }
 
  
  startListening(){
// Put the object into storage
   this.allMessages = JSON.parse(localStorage.getItem('messages')) || [];
   this.all10Messages = JSON.parse(localStorage.getItem('10messages')) || [];

    this.peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        // get all messages from local storage
        this.allMessages.push(data);
        //this.all10Messages.push(data);

        if (this.allMessages.length > 9){
          const numberOfLastMessages = (this.allMessages.length % 10)+1;
          this.all10Messages = this.allMessages.slice((this.allMessages.length-numberOfLastMessages),(this.allMessages.length));
        }else{
          this.all10Messages = this.allMessages;
        }

        //if (this.all10Messages.length > 9){
          //this.all10Messages=[];
       // }


        localStorage.setItem('10messages', JSON.stringify(this.all10Messages));
        console.log("display message ["+this.all10Messages+"]");

        // set new data on Local storage
      localStorage.setItem('messages', JSON.stringify(this.allMessages));
        console.log(this.allMessages);
      });
      conn.on("open", () => {
        conn.send("hello!");
      });
    });
  }
  
  
}
