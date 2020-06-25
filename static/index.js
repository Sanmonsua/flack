const msgSendTemplate = Handlebars.compile(document.querySelector('#msg_send').innerHTML);
const msgReceiveTemplate = Handlebars.compile(document.querySelector('#msg_received').innerHTML);
const channelTemplate = Handlebars.compile(document.querySelector('#channel').innerHTML);

let channels = []
let messages = []

document.addEventListener('DOMContentLoaded', () =>{
  let channel1 = {"name":"general", "creator":"asfdsfk"};
  let channel2 = {"name":"abcd", "creator":"flack"};
  channels.push(channel1);
  channels.push(channel2);

  channels.forEach( c => {
    console.log(c);
    const channel = channelTemplate(c);
    document.querySelector("#channels").innerHTML += channel;
  });

  document.querySelectorAll(".channel").forEach(c => {
    c.onclick = function() {
      console.log(this.name)
      document.querySelector("#channel-name").innerHTML = this.dataset.name;
      return false;
    }
  });


});
