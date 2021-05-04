//Brennan Aubuchon

/**
 * This project was created for CS3041: Human Computer Interaction
 * Author: Brennan Aubuchon
 *
 * Super Shuffle is proposed as a new music application that allows users to have more control
 * over the music they love to listen to.
 * This hi-fidelity prototype is made to simulate how the finished version might look and feel,
 * with the functionality of modifying playlists and presets fully implemented.
 * There are limitations, as the users are limited to the two given playlists, and their data will
 * be lost after they close the browser tab.
 *
 */

var songList = [];
var playlistList = [];
var previousPage = "";
var previousPage2 = "";

/**
 * The Playlist class is what is used to construct playlists
 * name - The name of the playlist
 * songs - The songs held by the playlist
 * presets - The presets held by the playlist
 */
class Playlist {
    constructor(name, songs, presets) {
        this.name = name;
        this.songs = songs;
        this.presets = presets;
    }

    /**
     * Will add the song to the playlist's list of songs
     * @param song - The songs to add
     */
    addSong(song) {
        this.songs.push(song);
    }

    /**
     * Will add the preset to the playlist's list of presets
     * @param preset - The preset to add
     */
    addPreset(preset) {
        this.presets.push(preset);
    }

    /**
     * Will remove the song from the playlist's list of songs
     * @param index - The location of the song to remove
     */
    removeSong(index) {
        this.songs.splice(index, 1);
    }

    /**
     * Will remove the preset from the playlist's list of presets
     * @param index - The location of the preset to remove
     */
    removePreset(index) {
        this.presets.splice(index, 1);
    }
}

/**
 * The Preset class is what is used to construct presets (a complex set of instructions for playing
 * songs)
 * name - The name of the preset
 * blocks - The list of blocks used by the preset
 */
class Preset {
    constructor(name, blocks) {
        this.name = name;
        this.blocks = blocks;
    }

    /**
     * Adds a block to the preset's list of blocks, depending on its type
     * @param block - The block to be added
     */
    addBlock(block) {
        //If this preset has no blocks yet, add this one without question
        if(this.blocks.length == 0) {
            this.blocks.push(block);
        } else {
            //Will use special scenarios depending on the block's type to determine how it should
            //be added, if at all
            switch(block.type) {
                case "startWith":
                    //If there is not a startWith block already, put this one to the front of the
                    //list
                    if(this.blocks[0].type != "startWith") {
                        this.blocks.unshift(block);
                    }
                    break;
                case "shuffleRest":
                    //If the playlist currently ends with the other "rest" block, replace it
                    if(this.blocks[this.blocks.length - 1].type == "inOrderRest") {
                        this.blocks.pop();
                        this.blocks.push(block);
                        //If the playlist currently ends with this block, do nothing
                    } else if(this.blocks[this.blocks.length - 1].type == "shuffleRest") {

                        //Otherwise, add this block to the end of the list
                    } else {
                        this.blocks.push(block);
                    }
                    break;
                case "inOrderRest":
                    //If the playlist currently ends with the other "rest" block, replace it
                    if(this.blocks[this.blocks.length - 1].type == "shuffleRest") {
                        this.blocks.pop();
                        this.blocks.push(block);
                        //If the playlist currently ends with this block, do nothing
                    } else if(this.blocks[this.blocks.length - 1].type == "inOrderRest") {

                        //Otherwise, add this block to the end of the list
                    } else {
                        this.blocks.push(block);
                    }
                    break;
                default:
                    //If the playlist ends with either of the "rest" blocks, put this one in right
                    //before that
                    if(this.blocks[this.blocks.length - 1].type == "shuffleRest" || this.blocks[this.blocks.length - 1].type == "inOrderRest") {
                        this.blocks.splice(this.blocks.length - 1, 0, block);
                        //Otherwise, put it on the end of the list
                    } else {
                        this.blocks.push(block);
                    }
            }
        }
    }

    /**
     * Will remove the block from the preset's list of blocks
     * @param index - The location of the block to be removed
     */
    removeBlock(index) {
        this.blocks.splice(index, 1);
    }
}

/**
 * The Block class is what is used to create the blocks (a specific instruction for playing songs)
 * type - Indicates what instructions the block will execute
 * songs - The songs to be affected by this block
 */
class Block {
    constructor(type, songs) {
        this.type = type;
        this.songs = songs;
    }

    /**
     * Adds the song to the block's list of songs
     * @param song - The song to be added
     */
    addSong(song) {
        this.songs.push(song);
    }

    /**
     * Removes the song from the block's list of songs
     * @param index - The location of the song to be removed
     */
    removeSong(index) {
        this.songs.splice(index, 1);
    }
}

/**
 * Prepares the default list of songs, so that they are available when preparing the playlists
 */
function initializeSongs() {
    //I just used the current top 10 songs, I don't actually know these

    //If the songs are not already in session storage, make them here and add them to session
    //storage
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
        //Otherwise, get them from session storage
    } else {
        songList = JSON.parse(sessionStorage.getItem("songList"));
    }
}

/**
 * Adds the given song to the list of songs
 * @param song - The song to be added
 */
function addSong(song) {
    songList.push(song);
    sessionStorage.setItem("songList", JSON.stringify(songList));
}

/**
 * Adds a new song with the given title and artist to the list of songs
 * @param songTitle - The title of the song
 * @param songArtist - The artist who made the song
 */
function addSong(songTitle, songArtist) {
    songList.push({title: songTitle, artist: songArtist});
    sessionStorage.setItem("songList", JSON.stringify(songList));
}

/**
 * Initializes the playlists so that their information can be used to construct the pages later on
 */
function initializePlaylists() {

    //If the playlist data is not yet in session storage, make it here and add it to session
    //storage
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
        //Otherwise get the information from session storage and turn the objects back into
        //instances of their classes
    } else {
        var tempPlaylistList = JSON.parse(sessionStorage.getItem("playlistList"));

        //For each of the playlists in session storage, make a playlist object
        for(var i = 0; i < tempPlaylistList.length; i++) {
            var tp = tempPlaylistList[i];
            var pList = [];

            //For each of the presets in this playlist, make a preset object
            for(var j = 0; j < tp.presets.length; j++) {
                var tpp = tp.presets[j];
                var bList = [];

                //For each of the blocks in this preset, make a block object
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

/**
 * Run by every page on start up, to make sure they have all the information they could need
 */
function initialize() {

    initializeSongs();

    initializePlaylists();

}

/**
 * Loads the songs to the page of the given playlist
 * @param index - The index of the playlist on the playlistList
 */
function loadPlaylistSongs(index) {
    let plSongs = playlistList[index].songs;
    //For each of the songs in the playlist, make a new item on the list
    for(var i = 0; i < plSongs.length; i++) {

        var node = document.createTextNode(plSongs[i].title);
        var para = document.createElement("dt");

        var img = document.createElement("i");
        img.setAttribute("class", "fas fa-minus-circle");
        para.appendChild(img);

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

/**
 * Removes a song from the playlist, also removes it from any blocks that use it
 * @param indexp - The index of the playlist in playlistList
 * @param indexs - The index of the song on the playlist's list of songs
 */
function removePlaylistSong(indexp, indexs) {
    var theSong = playlistList[indexp].songs[indexs];
    playlistList[indexp].removeSong(indexs);
    var elem = document.getElementById("song" + indexs);
    elem.remove();
    var elem2 = document.getElementById("artist" + indexs);
    elem2.remove();

    var pre = playlistList[indexp].presets;
    //Search through each preset
    for(var i = 0; i < pre.length; i++) {
        var blo = pre[i].blocks;
        //For each preset, search through each block
        for(var j = 0; j < blo.length; j++) {
            var so = blo[j].songs;
            //For each block, look at each song
            for(var k = 0; k < so.length; k++) {
                //If the title and artist match, remove the song from the block
                if(so[k].title == theSong.title && so[k].artist == theSong.artist) {
                    playlistList[indexp].presets[i].blocks[j].removeSong(k);
                    k--;
                }
            }
        }
    }

    sessionStorage.setItem("playlistList", JSON.stringify(playlistList));
}

/**
 * Loads in all of the songs from the songList to be added to a playlist
 */
function loadAllSongs() {
    previousPage = sessionStorage.getItem("PreviousPage");
    var back_button = document.getElementById("back_button");
    back_button.setAttribute("href", previousPage + ".html");

    //For each song in the songList, create an item on the list
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

/**
 * Adds the given song to the given playlist
 * @param indexp - The index of the playlist in playlistList
 * @param indexs - The index of the song in songList
 */
function addPlaylistSong(indexp, indexs) {
    var pNum = parseInt(indexp[8]) - 1;
    playlistList[pNum].addSong(songList[indexs]);

    sessionStorage.setItem("playlistList", JSON.stringify(playlistList));

    window.location.href = indexp + ".html";
}

/**
 * Sets the previousPage variable to its default value (index)
 */
function setPreviousPage() {
    previousPage = "index";
    sessionStorage.setItem("PreviousPage", previousPage);
}

/**
 * Loads in the list of presets for a playlist to be played or edited
 * @param index - The index of the playlist whose presets to display
 */
function loadPresets(index) {
    previousPage = sessionStorage.getItem("PreviousPage");
    var back_button = document.getElementById("back_button");
    back_button.setAttribute("href", previousPage + ".html");

    //If the playlist is Playlist 2, and the user has already created the preset, change what is
    //shown
    if(index == 1 && playlistList[index].presets.length > 0) {
        var temp = document.getElementById("temp");
        temp.remove();

        var spNode = document.createTextNode("Create Preset");

        var spLi = document.createElement("li");
        spLi.appendChild(spNode);

        var r = document.getElementById("randomId");
        var l = document.getElementById("preset_list");
        l.insertBefore(spLi, r);
    }

    var pre = playlistList[index].presets;
    //For each preset in this playlist, create a new item in the list
    for(var i = 0; i < pre.length; i++) {
        var node = document.createTextNode(pre[i].name);

        var node2 = document.createElement("i");
        node2.setAttribute("class", "fas fa-cog fa-2x");
        var para2 = document.createElement("a");
        para2.appendChild(node2);
        para2.setAttribute("href", "EditPlaylist" + (index + 1) + "P" + (i + 1) + ".html");

        var node3 = document.createElement("i");
        node3.setAttribute("id", "icon" + i);
        node3.setAttribute("class", "fas fa-play fa-2x");
        var para3 = document.createElement("a");
        para3.appendChild(node3);
        para3.setAttribute("href", "Playlist" + (index + 1) + "Preset" + (i + 1) + ".html");

        var li = document.getElementById("p" + (i + 1));
        li.appendChild(node);
        li.appendChild(para3);
        li.appendChild(para2);
    }
}

/**
 * Loads in a specific preset for editing
 * @param indexplay - The index of the playlist which owns this preset
 * @param indexpre - The index of this preset in the playlist's list of presets
 */
function loadPreset(indexplay, indexpre) {

    //If the playlist is Playlist 2, and the user is creating the preset for the first time, add a
    //preset to Playlist 2
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

    //For each block in the preset, create a new item on the list
    for(var i = 0; i < pre.blocks.length; i++) {
        var li = document.createElement("li");

        var img3 = document.createElement("i");
        img3.setAttribute("class", "fas fa-minus-circle");
        li.appendChild(img3);

        var type = document.createTextNode(pre.blocks[i].type);
        li.appendChild(type);
        li.setAttribute("id", "b" + i);
        li.setAttribute("class", pre.blocks[i].type);
        li.setAttribute("onclick", "removePresetBlock(" + indexplay + ", " + indexpre + ", " + i + ")");

        var dl = document.createElement("dl");

        var so = pre.blocks[i].songs;
        //For all of the songs in this block, create new items on the list inside the block
        for(var j = 0; j < so.length; j++) {
            var node = document.createTextNode(so[j].title);
            var para = document.createElement("dt");

            var img = document.createElement("i");
            img.setAttribute("class", "fas fa-minus-circle");
            para.appendChild(img);

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
        //If the blocks are not either of the "rest" blocks, allow the user to add songs
        if(pre.blocks[i].type != "shuffleRest" && pre.blocks[i].type != "inOrderRest") {
            var addS = document.createElement("dt");
            addS.setAttribute("class", "addS");
            var addNode = document.createTextNode("Add Songs");
            var link = document.createElement("a");
            link.setAttribute("class", "addSS");

            var img2 = document.createElement("i");
            img2.setAttribute("class", "fas fa-plus-circle");
            link.appendChild(img2);

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

/**
 * Will set the parameter of the "block" value in session storage, in order to remember which block
 * to add the song to
 * @param index - The index of the block in the preset's list of blocks
 * @param event - Mouse-click event, here to prevent propagation
 */
function setBlock(index, event) {
    sessionStorage.setItem("Block", index);
    event.stopPropagation();
}

/**
 * Load the songs in a playlist so that they can be added to a block
 */
function loadAddPlaylistSongs() {
    previousPage2 = sessionStorage.getItem("PreviousPage2");
    var back_button = document.getElementById("back_button");
    back_button.setAttribute("href", previousPage2 + ".html");
    var index = parseInt(previousPage2[12]) - 1;
    var index2 = parseInt(previousPage2[14]) - 1;
    var block = sessionStorage.getItem("Block");

    let plSongs = playlistList[index].songs;
    //For each of the songs in the playlist, create a new item in the list
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

/**
 * Adds a song to the specified block
 * @param play - The index of the playlist this preset belongs to
 * @param pre - The index of the preset this block belongs to
 * @param blo - The index of the block in the preset
 * @param so - The index of the song in the playlist's list of songs
 */
function addPresetSong(play, pre, blo, so) {
    playlistList[play].presets[pre].blocks[blo].addSong(playlistList[play].songs[so]);

    sessionStorage.setItem("playlistList", JSON.stringify(playlistList));

    window.location.href = "EditPlaylist" + (play + 1) + "P" + (pre + 1) + ".html";
}

/**
 * Removes a song from the specified block
 * @param play - The index of the playlist this preset belongs to
 * @param pre - The index of the preset this block belongs to
 * @param blo - The index of the block in the preset
 * @param so - The index of the song to be removed in the block's list of songs
 * @param event - Mouse-click event, here to prevent propagation
 */
function removePresetSong(play, pre, blo, so, event) {
    playlistList[play].presets[pre].blocks[blo].removeSong(so);
    var elem = document.getElementById("b" + blo + "s" + so);
    elem.remove();
    var elem2 = document.getElementById("b" + blo + "a" + so);
    elem2.remove();

    sessionStorage.setItem("playlistList", JSON.stringify(playlistList));
    event.stopPropagation();
}

/**
 * Loads all of the currently available blocks so they can be added to a preset
 */
function loadAllBlocks() {
    previousPage2 = sessionStorage.getItem("PreviousPage2");
    var back_button = document.getElementById("back_button");
    back_button.setAttribute("href", previousPage2 + ".html");
    var index = parseInt(previousPage2[12]) - 1;
    var index2 = parseInt(previousPage2[14]) - 1;

    var children = document.getElementById("block_list").children;
    //For each of the blocks, assign them an onclick attribute so that they can be added to the
    //right place
    for(var i = 0; i < children.length; i++) {
        children[i].setAttribute("onclick", "addPresetBlock(" + index + ", " + index2 + ", \'" + children[i].id + "\')");
    }
}

/**
 * Adds in the given block to the given preset
 * @param play - The index of the playlist which this preset belongs to
 * @param pre - The index of the preset in the playlist
 * @param blo - The block to be added
 */
function addPresetBlock(play, pre, blo) {
    let b1 = new Block(blo, []);
    playlistList[play].presets[pre].addBlock(b1);

    sessionStorage.setItem("playlistList", JSON.stringify(playlistList));

    window.location.href = "EditPlaylist" + (play + 1) + "P" + (pre + 1) + ".html";
}

/**
 * Removes the given block from the given preset
 * @param play - The index of the playlist which this preset belongs to
 * @param pre - The index of the preset in the playlist
 * @param blo - The index of the block to be removed
 */
function removePresetBlock(play, pre, blo) {
    playlistList[play].presets[pre].removeBlock(blo);
    var elem = document.getElementById("b" + blo);
    elem.remove();

    sessionStorage.setItem("playlistList", JSON.stringify(playlistList));
}

/**
 * Will play the songs of the given playlist in the order which they appear
 * @param index - The index of the playlist
 */
function playInOrder(index) {
    var theSongs = playlistList[index].songs;

    inOrder(theSongs);
}

/**
 * Will play the songs of the given playlist in a random order
 * @param index - The index of the playlist
 */
function playShuffled(index) {
    var theSongs = playlistList[index].songs;

    shuffle(theSongs);
}

/**
 * Will play the songs of the given playlist according to the instructions given in the preset
 * @param play - The index of the playlist
 * @param pre - The index of the preset to follow
 */
function playPreset(play, pre) {
    var theBlocks = playlistList[play].presets[pre].blocks;

    var rest = playlistList[play].songs;
    //Will loop through and set up the "rest" list which is used by the two "rest" blocks
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

    //For each of the blocks in the preset, follow their instructions
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

/**
 * Will play the given songs in the order that they came, setting them up on screen
 * @param songs - The songs to be played
 */
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

/**
 * Will play the given songs in a random order, setting them up on screen
 * @param songs - The songs to be played
 */
function shuffle(songs) {
    var tempList = [];

    for(var i = songs.length - 1; i > -1; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        tempList.push(songs[rand]);
        songs.splice(rand, 1);
    }

    inOrder(tempList);
}

