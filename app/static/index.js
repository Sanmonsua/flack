const msgSendTemplate = Handlebars.compile(document.querySelector('#msg_send').innerHTML);
const msgReceiveTemplate = Handlebars.compile(document.querySelector('#msg_received').innerHTML);
const channelTemplate = Handlebars.compile(document.querySelector('#channel').innerHTML);


document.addEventListener('DOMContentLoaded', () =>{

  loadChannelsList();
  loadChannelSelected();

  document.querySelector('#addChannel').disabled = true;

  document.querySelector('#inputAddChannel').onkeyup = function(){
    if (this.value.length > 0){
      document.querySelector('#addChannel').disabled = false;
    } else{
      document.querySelector('#addChannel').disabled = true;
    }
  }

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


  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  socket.on('connect', () =>{
    document.querySelector('#submit-message').disabled = true;

    document.querySelector('#input-message').onkeyup = function(){
      if (this.value.length > 0){
        document.querySelector('#submit-message').disabled = false;
      } else{
        document.querySelector('#submit-message').disabled = true;
      }
    }

    document.querySelector('#send-message-form').onsubmit = () =>{
      const message = document.querySelector('#input-message').value;
      socket.emit('send message', {'message':message});
      document.querySelector('#input-message').value = "";
      return false;
    };
  });

  socket.on('message data', data =>{
    if (document.querySelector('#chat').dataset.channel == data.channel){
      if (document.querySelector('#chat').dataset.username == data.creator){
        var msg = msgSendTemplate(data);
      } else{
        var msg = msgReceiveTemplate(data);
      }
      document.querySelector('#chat').innerHTML += msg;
      document.querySelector('#chat').scrollTop = document.querySelector('#chat').scrollHeight;

      const requestLoadChannel = new XMLHttpRequest();
      requestLoadChannel.open('POST', '/load-channel');

      requestLoadChannel.onload = () => {
        document.querySelector('#chat').innerHTML = "";
        const channel = JSON.parse(requestLoadChannel.responseText);
        document.querySelector('#channel-name').innerHTML = channel.name;
        document.querySelector('#messagesCount').innerHTML = channel.messages.length + " messages";
        document.querySelector('#chat').dataset.channel = channel.name;
        const username = document.querySelector('#chat').dataset.username;
        channel.messages.forEach(m => {
          if (m.creator == username){
            var message = msgSendTemplate(m);
          } else{
            var message = msgReceiveTemplate(m);
          }
          document.querySelector('#chat').innerHTML += message;
          document.querySelector('#chat').scrollTop = document.querySelector('#chat').scrollHeight;
        });
      }

      const data_request = new FormData();
      data_request.append('name', data.channel);
      requestLoadChannel.send(data_request);
    }
  });

});


function loadChannelsList(){
  const request = new XMLHttpRequest();
  request.open('GET', '/channels');

  request.onload = () =>{
    const channels = JSON.parse(request.responseText);
    document.querySelector("#channels").innerHTML = "";
    channels.forEach( c => {
      const channel = channelTemplate(c);
      document.querySelector("#channels").innerHTML += channel;
    });

    document.querySelectorAll(".channel").forEach(c => {
      c.onclick = function() {
        const requestLoadChannel = new XMLHttpRequest();
        requestLoadChannel.open('POST', '/load-channel');

        requestLoadChannel.onload = () => {
          document.querySelector('#chat').innerHTML = "";
          const channel = JSON.parse(requestLoadChannel.responseText);
          document.querySelector('#channel-name').innerHTML = channel.name;
          document.querySelector('#messagesCount').innerHTML = channel.messages.length + " messages";
          document.querySelector('#chat').dataset.channel = channel.name;
          const username = document.querySelector('#chat').dataset.username;
          channel.messages.forEach(m => {
            if (m.creator == username){
              var message = msgSendTemplate(m);
            } else{
              var message = msgReceiveTemplate(m);
            }
            document.querySelector('#chat').innerHTML += message;
            document.querySelector('#chat').scrollTop = document.querySelector('#chat').scrollHeight;
          });
        }

        const data = new FormData();
        data.append('name', this.dataset.name);
        requestLoadChannel.send(data);
      };
    });
  }

  request.send();
}


function loadChannelSelected() {
  const requestLoadChannel = new XMLHttpRequest();
  requestLoadChannel.open('GET', '/load-channel');

  requestLoadChannel.onload = () => {
    document.querySelector('#chat').innerHTML = "";
    const channel = JSON.parse(requestLoadChannel.responseText);
    document.querySelector('#channel-name').innerHTML = channel.name;
    document.querySelector('#messagesCount').innerHTML = channel.messages.length + " messages";
    document.querySelector('#chat').dataset.channel = channel.name;
    const username = document.querySelector('#chat').dataset.username;
    channel.messages.forEach(m => {
      if (m.creator == username){
        var message = msgSendTemplate(m);
      } else{
        var message = msgReceiveTemplate(m);
      }
      document.querySelector('#chat').innerHTML += message;
      document.querySelector('#chat').scrollTop = document.querySelector('#chat').scrollHeight;
    });
  }

  requestLoadChannel.send();
}
