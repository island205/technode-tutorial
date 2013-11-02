$(function () {
  // $('.log-in-modal').modal()
  var socket = io.connect('http://localhost:3000')
  var rooms = {}
  var user = {}
  $message = $('.message')
  $('.btn-send').on('click', function (evt) {
    evt.preventDefault()
    var message = $message.val()
    if (message) {
      $message.val('')
      socket.emit('add:message', {message:message, user:user})
    }
  })
  socket.on('read:rooms', function (data) {
    rooms = data
    roomsData = Object.keys(rooms).map(function (key) {
      return rooms[key]
    })
    // modal for login name
    $.tmpl('<li><a href="#">${name}</a></li>', roomsData).appendTo($('.dropdown-rooms'))
    var $dropdownRoomsLabel = $('.dropdown-rooms-label').html(roomsData[0].name)

    // render rooms
    tmpl('#list-room-item', {rooms:roomsData})
      .appendTo($('.room-list'))
    $('.room-list a').first().addClass('active')
    $('.room-header').html(roomsData[0].name)

    $('.log-in-modal').modal()
    $('.dropdown-rooms li a').on('click', function () {
      $dropdownRoomsLabel.html($(this).html())
    })

    var $userEmail = $('.user-email')

    $('.log-in-modal .btn-enter').on('click', function (evt) {
      evt.preventDefault()
      if (/^.*@gmail.com$/.test($userEmail.val())) {
        socket.emit('add:user', {
          email: $userEmail.val(),
          room: $dropdownRoomsLabel.html()
        })
        $('.log-in-modal').modal('hide')
      } else {
        $userEmail.focus()
      }
    })
  })

  socket.on('add:user', function (data) {
    user = data
    rooms[user.room].users.push(user)
    addUser(user)
  })

  socket.on('add:message', function (data) {
    rooms[data.user.room].messages.push(data)
    updateTimeline(data)
  })

  socket.emit('read:rooms')

  function addUser(user) {
    var $room = $('.room-' + user.room)
    $room.find('h4 span').html(rooms[user.room].users.length)
    $.tmpl('<img alt="..." src="${avatar}" class="img-rounded" />', user).appendTo($room.find('.avatar-list'))
  }
  $timeline = $('.timeline')
  function updateTimeline(message) {
    $.tmpl('<div class="list-group-item"><img alt="..." src="${user.avatar}" class="img-rounded" />:${message}</div>', message).appendTo($timeline)
  }
  function tmpl(id, data) {
    return $(Mustache.render($(id).html(), data))
  }
})