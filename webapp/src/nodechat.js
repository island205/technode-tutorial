$(function () {
  var socket = io.connect('http://localhost:3000')
  var rooms = {}
  var user = {}
  $message = $('.message-input')
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

    $('.room-item').on('click', function (evt) {
      var $room = $(this)
      var room = $room.attr('data-name')
      user.room = room
      $('.room-item').removeClass('in')
      $room.addClass('in')
      $('.room-header').html(room)
      $('.timeline .list-group').html(tmpl('#list-message-item', {messages:rooms[room].messages.map(function (message) {
        if (message.user.id == user.id) {
          message.isMe = true
        } else {
          message.isMe = false
        }
        return message
      })}))
      socket.emit('update:user', user)
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
  socket.on('login', function (user) {
    $('.room-' + user.room).addClass('in')
  })
  socket.on('changeRoom:user', function (data) {
    var u = data[0]
    var oldRoom = data[1]
    $('.room-' + oldRoom).find('.user-' + u.id).appendTo($('.room-' + u.room).find('.avatar-list'))
  })

  socket.emit('read:rooms')

  function addUser(user) {
    var $room = $('.room-' + user.room)
    $room.find('h4 span').html(rooms[user.room].users.length)
    $.tmpl('<img alt="..." src="${avatar}" class="img-rounded user-${id}" />', user).appendTo($room.find('.avatar-list'))
  }
  $timeline = $('.timeline .list-group')
  function updateTimeline(message) {
    tmpl('#list-message-item', {messages:[message].map(function (message) {
        if (message.user.id == user.id) {
          message.isMe = true
        } else {
          message.isMe = false
        }
        return message
      })}).appendTo($timeline)
  }
  function tmpl(id, data) {
    return $(Mustache.render($(id).html(), data))
  }
})