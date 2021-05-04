//Brennan Aubuchon

var songList = [];
var playlistList = [];
var previousPage = "";
var previousPage2 = "";

class Playlist {
    constructor(name, songs, presets) {
        this.name = name;
        this.songs = songs;
        this.presets = presets;
    }
    addSong(song) {
        this.songs.push(song);
    }
    addPreset(preset) {
        this.presets.push(preset);
    }
    removeSong(index) {
        this.songs.splice(index, 1);
    }
    removePreset(index) {
        this.presets.splice(index, 1);
    }
}

class Preset {
    constructor(name, blocks) {
        this.name = name;
        this.blocks = blocks;
    }
    addBlock(block) {
        if(this.blocks.length == 0) {
            this.blocks.push(block);
        } else {
            switch(block.type) {
                case "startWith":
                    if(this.blocks[0].type != "startWith") {
                        this.blocks.unshift(block);
                    }
                    break;
                case "shuffleRest":
                    if(this.blocks[this.blocks.length - 1].type == "inOrderRest") {
                        this.blocks.pop();
                        this.blocks.push(block);
                    } else if(this.blocks[this.blocks.length - 1].type == "shuffleRest") {

                    } else {
                        this.blocks.push(block);
                    }
                    break;
                case "inOrderRest":
                    if(this.blocks[this.blocks.length - 1].type == "shuffleRest") {
                        this.blocks.pop();
                        this.blocks.push(block);
                    } else if(this.blocks[this.blocks.length - 1].type == "inOrderRest") {

                    } else {
                        this.blocks.push(block);
                    }
                    break;
                default:
                    if(this.blocks[this.blocks.length - 1].type == "shuffleRest" || this.blocks[this.blocks.length - 1].type == "inOrderRest") {
                        this.blocks.splice(this.blocks.length - 1, 0, block);
                    } else {
                        this.blocks.push(block);
                    }
            }
        }
    }
    removeBlock(index) {
        this.blocks.splice(index, 1);
    }
}

class Block {
    constructor(type, songs) {
        this.type = type;
        this.songs = songs;
    }
    addSong(song) {
        this.songs.push(song);
    }
    removeSong(index) {
        this.songs.splice(index, 1);
    }
}

function initializeSongs() {
    //I just used the current top 10 songs, I don't actually know these

    if(sessionStorage.getItem("songList") == null) {
        var song1 = {title: "Rapstar", artist: "Polo G"};
        var song2 = {title: "Leave the Door Open", artist: "Silk Sonic"};
        var song3 = {title: "Peaches", artist: "Justin Bieber"};
        var song4 = {title: "Montero", artist: "Lil Nas X"};
        var song5 = {title: "Levitating", artist: "Dua Lipa"};
        var song6 = {title: "Save Your Tears", artist: "The Weeknd"};
        var song7 = {title: "Astronaut In The Ocean", artist: "Masked Wolf"};
        var song8 = {title: "Kiss Me More", artist: "Doja Cat"};
        var song9 = {title: "Up", artist: "Cardi B"};
        var song10 = {title: "Drivers License", artist: "Olivia Rodrigo"};

        songList.push(song1, song2, song3, song4, song5, song6, song7, song8, song9, song10);

        sessionStorage.setItem("songList", JSON.stringify(songList));
    } else {
        songList = JSON.parse(sessionStorage.getItem("songList"));
    }
}

function addSong(song) {
    songList.push(song);
}

function addSong(songTitle, songArtist) {
    songList.push({title: songTitle, artist: songArtist});
}

function initializePlaylists() {

    if(sessionStorage.getItem("playlistList") == null) {
        let block01 = new Block("shuffle", [songList[2], songList[3], songList[4]]);
        let block02 = new Block("inOrder", [songList[1], songList[0]]);
        let block03 = new Block("startWith", [songList[1], songList[4]]);
        let block04 = new Block("shuffleRest", []);

        let preset1 = new Preset("Preset 1", [block01, block02]);
        let preset2 = new Preset("Preset 2", [block03, block04]);

        let playlist1 = new Playlist("Playlist1", [songList[0], songList[1], songList[2], songList[3], songList[4]], [preset1, preset2]);
        let playlist2 = new Playlist("Playlist2", [songList[5], songList[6], songList[7], songList[8], songList[9]], []);

        playlistList.push(playlist1, playlist2);

        sessionStorage.setItem("playlistList", JSON.stringify(playlistList));
    } else {
        var tempPlaylistList = JSON.parse(sessionStorage.getItem("playlistList"));

        for(var i = 0; i < tempPlaylistList.length; i++) {
            var tp = tempPlaylistList[i];
            var pList = [];

            for(var j = 0; j < tp.presets.length; j++) {
                var tpp = tp.presets[j];
                var bList = [];

                for(var k = 0; k < tpp.blocks.length; k++) {
                    var tppb = tpp.blocks[k];
                    let block = new Block(tppb.type, tppb.songs);
                    bList.push(block);
                }

                let preset = new Preset(tpp.name, bList);
                pList.push(preset);
            }

            let playlist = new Playlist(tp.name, tp.songs, pList);
            playlistList.push(playlist);
        }
    }
}

function initialize() {

    initializeSongs();

    initializePlaylists();

}

function loadPlaylistSongs(index) {
    let plSongs = playlistList[index].songs;
    for(var i = 0; i < plSongs.length; i++) {

        var node = document.createTextNode(plSongs[i].title);
        var para = document.createElement("dt");
        para.appendChild(node);
        para.setAttribute("id", "song" + i);
        para.setAttribute("onclick", "removePlaylistSong(" + index + ", " + i + ")");

        var elem = document.getElementById("song_list");
        var addS = document.getElementById("addS");
        elem.insertBefore(para, addS);

        var node2 = document.createTextNode("- " + plSongs[i].artist);
        var para2 = document.createElement("dd");
        para2.appendChild(node2);
        para2.setAttribute("id", "artist" + i);

        elem.insertBefore(para2, addS);
    }

    previousPage = "Playlist" + (index + 1);
    sessionStorage.setItem("PreviousPage", previousPage);
}

function removePlaylistSong(indexp, indexs) {
    var theSong = playlistList[indexp].songs[indexs];
    playlistList[indexp].removeSong(indexs);
    var elem = document.getElementById("song" + indexs);
    elem.remove();
    var elem2 = document.getElementById("artist" + indexs);
    elem2.remove();

    var pre = playlistList[indexp].presets;
    for(var i = 0; i < pre.length; i++) {
        var blo = pre[i].blocks;
        for(var j = 0; j < blo.length; j++) {
            var so = blo[j].songs;
            for(var k = 0; k < so.length; k++) {
                if(so[k].title == theSong.title && so[k].artist == theSong.artist) {
                    playlistList[indexp].presets[i].blocks[j].removeSong(k);
                    k--;
                }
            }
        }
    }

    sessionStorage.setItem("playlistList", JSON.stringify(playlistList));
}

function loadAllSongs() {
    previousPage = sessionStorage.getItem("PreviousPage");
    var back_button = document.getElementById("back_button");
    back_button.setAttribute("href", previousPage + ".html");

    for(var i = 0; i < songList.length; i++) {

        var node = document.createTextNode(songList[i].title);
        var para = document.createElement("dt");
        para.appendChild(node);
        para.setAttribute("id", "song" + i);
        para.setAttribute("onclick", "addPlaylistSong(\'" + previousPage + "\', " + i + ")");

        var elem = document.getElementById("song_list");
        elem.appendChild(para);

        var node2 = document.createTextNode("- " + songList[i].artist);
        var para2 = document.createElement("dd");
        para2.appendChild(node2);
        para2.setAttribute("id", "artist" + i);

        elem.appendChild(para2);
    }
}

function addPlaylistSong(indexp, indexs) {
    var pNum = parseInt(indexp[8]) - 1;
    playlistList[pNum].addSong(songList[indexs]);

    sessionStorage.setItem("playlistList", JSON.stringify(playlistList));

    window.location.href = indexp + ".html";
}

function setPreviousPage() {
    previousPage = "index";
    sessionStorage.setItem("PreviousPage", previousPage);
}

function loadPresets(index) {
    previousPage = sessionStorage.getItem("PreviousPage");
    var back_button = document.getElementById("back_button");
    back_button.setAttribute("href", previousPage + ".html");

    if(index == 1 && playlistList[index].presets.length > 0) {
        var temp = document.getElementById("temp");
        temp.remove();

        var spNode = document.createTextNode("Create Preset");
        var spPara = document.createElement("p");
        spPara.appendChild(spNode);

        var spLi = document.createElement("li");
        spLi.appendChild(spPara);

        var r = document.getElementById("randomId");
        var l = document.getElementById("preset_list");
        l.insertBefore(spLi, r);
    }

    var pre = playlistList[index].presets;
    for(var i = 0; i < pre.length; i++) {
        var node = document.createTextNode(pre[i].name);
        var para = document.createElement("p");
        para.appendChild(node);

        var node2 = document.createTextNode("Edit");
        var para2 = document.createElement("a");
        para2.appendChild(node2);
        para2.setAttribute("href", "EditPlaylist" + (index + 1) + "P" + (i + 1) + ".html");

        var node3 = document.createTextNode("Play");
        var para3 = document.createElement("a");
        para3.appendChild(node3);
        para3.setAttribute("href", "Playlist" + (index + 1) + "Preset" + (i + 1) + ".html");

        var li = document.getElementById("p" + (i + 1));
        li.appendChild(para);
        li.appendChild(para2);
        li.appendChild(para3);
    }
}

function loadPreset(indexplay, indexpre) {

    if(indexplay == 1 && playlistList[indexplay].presets.length == 0) {
        let pre1 = new Preset("Preset 1", []);
        playlistList[indexplay].addPreset(pre1);

        sessionStorage.setItem("playlistList", JSON.stringify(playlistList));
    }

    var pre = playlistList[indexplay].presets[indexpre];

    var title = document.createTextNode(pre.name);
    var loc = document.getElementById("preset_title");
    loc.appendChild(title);

    var bList = document.getElementById("block_list");

    for(var i = 0; i < pre.blocks.length; i++) {
        var li = document.createElement("li");
        var type = document.createTextNode(pre.blocks[i].type);
        li.appendChild(type);
        li.setAttribute("id", "b" + i);
        li.setAttribute("onclick", "removePresetBlock(" + indexplay + ", " + indexpre + ", " + i + ")");

        var dl = document.createElement("dl");

        var so = pre.blocks[i].songs;
        for(var j = 0; j < so.length; j++) {
            var node = document.createTextNode(so[j].title);
            var para = document.createElement("dt");
            para.setAttribute("id", "b" + i + "s" + j);
            para.setAttribute("onclick", "removePresetSong(" + indexplay + ", " + indexpre + ", " + i + ", " + j + ", event)");
            para.appendChild(node);

            var node2 = document.createTextNode("- " + so[j].artist);
            var para2 = document.createElement("dd");
            para2.setAttribute("id", "b" + i + "a" + j);
            para2.appendChild(node2);

            dl.appendChild(para);
            dl.appendChild(para2);
        }
        if(pre.blocks[i].type != "shuffleRest" && pre.blocks[i].type != "inOrderRest") {
            var addS = document.createElement("dt");
            var addNode = document.createTextNode("Add Songs");
            var link = document.createElement("a");
            link.appendChild(addNode);
            link.setAttribute("href", "AddPresetSongs.html");
            link.setAttribute("onclick", "setBlock(" + i + ", event)");
            addS.appendChild(link);
            dl.appendChild(addS);
        }

        li.appendChild(dl);
        var addB = document.getElementById("addB");
        bList.insertBefore(li, addB);
    }

    previousPage2 = "EditPlaylist" + (indexplay + 1) + "P" + (indexpre + 1);
    sessionStorage.setItem("PreviousPage2", previousPage2);
}

function setBlock(index, event) {
    sessionStorage.setItem("Block", index);
    event.stopPropagation();
}

function loadAddPlaylistSongs() {
    previousPage2 = sessionStorage.getItem("PreviousPage2");
    var back_button = document.getElementById("back_button");
    back_button.setAttribute("href", previousPage2 + ".html");
    var index = parseInt(previousPage2[12]) - 1;
    var index2 = parseInt(previousPage2[14]) - 1;
    var block = sessionStorage.getItem("Block");

    let plSongs = playlistList[index].songs;
    for(var i = 0; i < plSongs.length; i++) {

        var node = document.createTextNode(plSongs[i].title);
        var para = document.createElement("dt");
        para.appendChild(node);
        para.setAttribute("id", "song" + i);
        para.setAttribute("onclick", "addPresetSong(" + index + ", " + index2 + ", " + block + ", " + i + ")");

        var elem = document.getElementById("song_list");
        elem.appendChild(para);

        var node2 = document.createTextNode("- " + plSongs[i].artist);
        var para2 = document.createElement("dd");
        para2.appendChild(node2);
        para2.setAttribute("id", "artist" + i);

        elem.appendChild(para2);
    }
}

function addPresetSong(play, pre, blo, so) {
    playlistList[play].presets[pre].blocks[blo].addSong(playlistList[play].songs[so]);

    sessionStorage.setItem("playlistList", JSON.stringify(playlistList));

    window.location.href = "EditPlaylist" + (play + 1) + "P" + (pre + 1) + ".html";
}

function removePresetSong(play, pre, blo, so, event) {
    playlistList[play].presets[pre].blocks[blo].removeSong(so);
    var elem = document.getElementById("b" + blo + "s" + so);
    elem.remove();
    var elem2 = document.getElementById("b" + blo + "a" + so);
    elem2.remove();

    sessionStorage.setItem("playlistList", JSON.stringify(playlistList));
    event.stopPropagation();
}

function loadAllBlocks() {
    previousPage2 = sessionStorage.getItem("PreviousPage2");
    var back_button = document.getElementById("back_button");
    back_button.setAttribute("href", previousPage2 + ".html");
    var index = parseInt(previousPage2[12]) - 1;
    var index2 = parseInt(previousPage2[14]) - 1;

    var children = document.getElementById("block_list").children;
    for(var i = 0; i < children.length; i++) {
        children[i].setAttribute("onclick", "addPresetBlock(" + index + ", " + index2 + ", \'" + children[i].id + "\')");
    }
}

function addPresetBlock(play, pre, blo) {
    let b1 = new Block(blo, []);
    playlistList[play].presets[pre].addBlock(b1);

    sessionStorage.setItem("playlistList", JSON.stringify(playlistList));

    window.location.href = "EditPlaylist" + (play + 1) + "P" + (pre + 1) + ".html";
}

function removePresetBlock(play, pre, blo) {
    playlistList[play].presets[pre].removeBlock(blo);
    var elem = document.getElementById("b" + blo);
    elem.remove();

    sessionStorage.setItem("playlistList", JSON.stringify(playlistList));
}

function playInOrder(index) {
    var theSongs = playlistList[index].songs;

    inOrder(theSongs);
}

function playShuffled(index) {
    var theSongs = playlistList[index].songs;

    shuffle(theSongs);
}

function playPreset(play, pre) {
    var theBlocks = playlistList[play].presets[pre].blocks;

    var rest = playlistList[play].songs;
    loop1:
    for(var i = 0; i < rest.length; i++) {
        loop2:
        for(var j = 0; j < theBlocks.length; j++) {
            loop3:
            for(var k = 0; k < theBlocks[j].songs.length; k++) {
                if(rest[i].title == theBlocks[j].songs[k].title && rest[i].artist == theBlocks[j].songs[k].artist) {
                    rest.splice(i, 1);
                    i--;
                    break loop2;
                }
            }
        }
    }

    for(var i = 0; i < theBlocks.length; i++) {
        switch(theBlocks[i].type) {
            case "startWith":
                inOrder(theBlocks[i].songs);
                break;
            case "shuffle":
                shuffle(theBlocks[i].songs);
                break;
            case "inOrder":
                inOrder(theBlocks[i].songs);
                break;
            case "shuffleRest":
                shuffle(rest);
                break;
            case "inOrderRest":
                inOrder(rest);
                break;
        }
    }
}

function inOrder(songs) {
    for(var i = 0; i < songs.length; i++) {
        var node = document.createTextNode(songs[i].title);
        var para = document.createElement("dt");
        para.appendChild(node);
        para.setAttribute("id", "song" + i);

        var elem = document.getElementById("song_list");
        elem.appendChild(para);

        var node2 = document.createTextNode("- " + songs[i].artist);
        var para2 = document.createElement("dd");
        para2.appendChild(node2);
        para2.setAttribute("id", "artist" + i);

        elem.appendChild(para2);
    }
}

function shuffle(songs) {
    var tempList = [];

    for(var i = songs.length - 1; i > -1; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        tempList.push(songs[rand]);
        songs.splice(rand, 1);
    }

    inOrder(tempList);
}

