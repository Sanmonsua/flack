const msgSendTemplate = Handlebars.compile(document.querySelector('#msg_send').innerHTML);
const msgReceiveTemplate = Handlebars.compile(document.querySelector('#msg_received').innerHTML);
const channelTemplate = Handlebars.compile(document.querySelector('#channel').innerHTML);


document.addEventListener('DOMContentLoaded', () =>{

  loadChannelsList();
  loadChannelSelected();

  document.querySelector('#addChannelForm').onsubmit = () =>{
    const request = new XMLHttpRequest();
    const name = document.querySelector('#inputAddChannel').value;
    request.open('post', '/add-channel');

    request.onload = () => {
      const response = JSON.parse(request.responseText);
      if (!response.existed) {
        loadChannelsList();
        loadChannelSelected();
      };
    };

    const data = new FormData();
    data.append('name', name);
    request.send(data);
    return false;
  };
});

function loadChannelsList(){
  const request = new XMLHttpRequest();
  request.open('GET', '/channels');

  request.onload = () =>{
    const channels = JSON.parse(request.responseText);
    channels.forEach( c => {
      const channel = channelTemplate(c);
      document.querySelector("#channels").innerHTML += channel;
    });

    document.querySelectorAll(".channel").forEach(c => {
      c.onclick = function() {
        const requestLoadChannel = new XMLHttpRequest();
        requestLoadChannel.open('POST', '/load-channel');

        requestLoadChannel.onload = () => {
          const channel = JSON.parse(requestLoadChannel.responseText);
          document.querySelector('#channel-name').innerHTML = channel.name;
          document.querySelector('#messagesCount').innerHTML = channel.messages.length + " messages";
        }

        const data = new FormData();
        data.append('name', this.dataset.name);
        requestLoadChannel.send(data);
        return false;
      };
    });
  }

  request.send();
}

function loadChannelSelected() {
  const request = new XMLHttpRequest();
  request.open('GET', '/load-channel');

  request.onload = () => {
    const channel = JSON.parse(request.responseText);
    document.querySelector('#channel-name').innerHTML = channel.name;
    document.querySelector('#messagesCount').innerHTML = channel.messages.length + " messages";
  }

  request.send();
}
