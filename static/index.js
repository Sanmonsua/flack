const msgSendTemplate = Handlebars.compile(document.querySelector('#msg_send').innerHTML);
const msgReceiveTemplate = Handlebars.compile(document.querySelector('#msg_received').innerHTML);
const channelTemplate = Handlebars.compile(document.querySelector('#channel').innerHTML);


document.addEventListener('DOMContentLoaded', () =>{

  load_channels();

  document.querySelector('#addChannelForm').onsubmit = () =>{
    const request = new XMLHttpRequest();
    const name = document.querySelector('#inputAddChannel').value;
    console.log(name);
    request.open('post', '/add-channel');

    const data = new FormData();
    console.log(name);
    data.append('name', name);
    request.send(data);
  };
});

function load_channels(){
  const request = new XMLHttpRequest();
  request.open('post', '/channels');

  request.onload = () =>{
    const channels = JSON.parse(request.responseText);
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
  }

  request.send();
}

function add_channel(){
  const request = new XMLHttpRequest();
  const name = document.querySelector('#inputAddChannel').value;
  console.log(name);
  request.open('post', '/add-channel');

  const data = new FormData();
  console.log(name);
  data.append('name', name);
  request.send(data);
  return false;
}
