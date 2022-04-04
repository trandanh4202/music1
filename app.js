const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const PLAYER_STORAGE_KEY = 'F8-Player'
const app = {

    currentIndex : 0,
    isPlaying : false,
    isRandom : false ,
    isRepeat : false , 
    config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
          name: "Hoa Hai Duong",
          singer: "Jack",
          path: "./audio/hoa-hai-duong.mp3",
          image: "./images/hoa-hai-duong.jpeg"
        },
        {
          name: "Khue Moc Lang",
          singer: "Huong Ly & Jombie",
          path: "./audio/khue-moc-lang.mp3",
          image: "./images/khue-moc-lang.jpeg"
        },
        {
          name: "Roi Toi Luon",
          singer: "Nal",
          path:"./audio/roi-toi-luon.mp3",
          image: "./images/roi-toi-luon.jpeg"
        },
        {
            name: "Sau Hong Gai",
            singer: "GR5",
            path:"./audio/sau-hong-gai.mp3",
            image: "./images/sau-hong-gai.jpeg"
        },
        {
            name: "Thien Dang",
            singer: "Wowy",
            path:"./audio/thien-dang.mp3",
            image: "./images/thien-dang.jpeg"
        },
        {
            name: "Thuong Nhau Toi Ben",
            singer: "Nal",
            path:"./audio/thuong-nhau-toi-ben.mp3",
            image: "./images/thuong-nhau-toi-ben.jpeg"
        },
        {
            name: "Y Chang Xuan Sang",
            singer: "tao",
            path:"./audio/y-chang-xuan-sang.mp3",
            image: "./images/y-chang-xuan-sang.jpeg"
        }
      ],

    setConfig(key,value){
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
        
    },

    render(){
        const htmls = this.songs.map((song,index) =>{
            return `
            <div class=" song ${index === this.currentIndex ? 'active' : '' }" data-index = ${index} >
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>

            `
        })
        $('.playlist').innerHTML = htmls.join("")
    },

    defineProperties(){
        Object.defineProperty(this,'currentSong',{
            get(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent(){
        const _this = this
        const cdWidth = cd.offsetWidth

        //xu ly CD quay 
        const cdThumbAnimate = cdThumb.animate([
            { transform : 'rotate(360deg)'}
        ], {
            duration : 10000 ,//10sec
            iteration : Infinity 
        })
        // xu ly phong to / thu nho CD 
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop 
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth
        }
        //xu ly khi clikc play
        playBtn.onclick = function(){
            if ( _this.isPlaying ){
                audio.pause()
            } else{
                audio.play()
            }
        }

        //khi bai hat duoc play
        audio.onplay = function(){
            _this.isPlaying = true ;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //khi bai hat bi pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()

        }


        //khi tien do bai hat thay doi 
        audio.ontimeupdate = function(){
            if ( audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        //xu ly khi tua xong
        progress.onchange = function(e){
            const seekTime = audio.duration/ 100 * e.target.value
            audio.currentTime = seekTime
        }

        //khi next bai hat
        nextBtn.onclick =function(){
            if ( _this.isRandom){
                _this.randomSong()
            }else {
                _this.nextSong();
            }
            audio.play();
            _this.render()
            _this.scrollToActiveSong()
        }

        //khi prev bai hat
        prevBtn.onclick =function(){
            if ( _this.isRandom){
                _this.randomSong()
            } else{
                _this.prevSong();
            }
            audio.pause();
            _this.render()
            _this.scrollToActiveSong()

        }

        // khi random bai hat
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRamdom',_this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        // xu ly lap lai 1 bai hat
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat',_this. isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }

        //xu ly next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }
        //lang nghe hanh vi click vao playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if ( songNode || e.target.closest('.option')){
                if ( songNode ){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if ( e.target.closest('.option')){

                }
            }
        }
    },
    
    scrollToActiveSong: function () {
        setTimeout(() => {
          $(".song.active").scrollIntoView({
            behavior: "smooth",
            block: "nearest"
          });
        }, 300);
      },
    loadCurrentSong(){
        heading.textContent=this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    
    loadConfig(){
        this.isRandom=this.config.isRandom
        this.isRepeat=this.config.isRepeat

    },
    nextSong(){
        this.currentIndex++
        if ( this.currentIndex >= this.songs.length - 1 ){
            this.currentIndex = 0 
        }
        this.loadCurrentSong();
    },

    prevSong(){
        this.currentIndex--
        if ( this.currentIndex <0 ){
            this.currentIndex = this.songs.length -1 
        }
        this.loadCurrentSong();
    },

    randomSong(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random()* this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong();
    },
    
    
    
    start(){
        //gan cau hinh tu config vao object 
        this.loadConfig()

        //dinh nghia cac thuoc tinh
        this.defineProperties()
        // lang nghe va xu li su kien DOM events
        this.handleEvent();
        //tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong()
        // render lai danh sach bai hat
        this.render();
            //hien thi trang thai ban dau cua btn repeat va random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active',this.isRepeat)

    }
}

app.start();
