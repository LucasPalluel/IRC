$(document).ready(function () {
    $.get('/channels').then(data => {
        for (const channel of data.channels) {
            const roomElement = document.createElement('div')
            roomElement.innerText = channel
            const roomLink = document.createElement('a')
            const br = document.createElement('br')
            const saut = document.createElement('br')
            roomLink.href = `/${channel}`
            roomLink.innerText = 'Join ' + channel
            roomLink.style.textDecoration = "none"
            roomLink.style.color = "#1E90FF"
            roomContainer.append(roomLink)
            roomContainer.append(br)
            roomContainer.append(saut)
        }
    })
});
