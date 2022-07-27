(()=>{

 const cnv = document.querySelector(`canvas`)

 //указываем в каком контексе с canvas мы будем работать
 const ctx = cnv.getContext(`2d`)

 const cfg = {
     orbsCount   : 400, //для хранения сфер нужен массив, поэтому объявим его как orbsList
     minVelocity : .2, // добавили свойство для минимальной скорости для перемещения
     ringsCount  : 10 // количество колец
    }
 
 //объявим переменные для хранения ширины и высоты для canvas
 //переменные x и y, необходимо для хранения переменных в центре
 let cw, ch, cx, cy, ph, pw
 //значения переменных cx и cy присвоем внутри функции resize
 function resize (){
     cw = cnv.width = innerWidth //cw будет равна ширине cnv, а ширина cnv будет равна ширине окна просмотра
     ch = cnv.height = innerHeight //так же делаем с высотой
    //центр x это половина ширина => нам нужно поделить на 0,5
    cx = cw * .5
    cy = ch * .5
    ph = cy * .4 //сместили частицу от центра6
    pw = cx * .4
}
resize()
window.addEventListener(`resize`, resize) //слушатель событий, чтобы адаптировать размер холста, если кто-то захчет измнить размеры области просмотра

//создаём первую сферу
class Orb {
    constructor(){
        this.size     = Math.random() * 6 + 2//радиус окружности //теперь размер сфер будет случайным
        //добавляем свойство градус
        this.angle    = Math.random() * 360 //т.к. в оружности 360` => зададим случайное значение от 0 до 360
        this.radius   = (Math.random() * cfg.ringsCount | 0) * ph / cfg.ringsCount
        this.impact   = this.radius / ph //чтобы размер сфер зависил от радиуса вращения
        this.velocity = cfg.minVelocity + Math.random() * cfg.minVelocity
        
    }
    
    // Добавляем метод, который в будущем будем вызывать каждый кадр анимации для движения и отрисовки сфер
    refresh(){
        let radian = this.angle * Math.PI / 180

        let cos    = Math.cos (radian)
        let sin    = Math.sin (radian)

        //объявляем переменную, которая отвечает за степень растягивания по ширине и смещаем её по X.
        let offsetX = cos * pw * this.impact
        let offsetY = sin * pw * this.impact
        
        let x      = cx + cos * (ph + this.radius)+ offsetX //по ширине прибавляем (+ offsetX), т.к. нужно растянуть. По высоте вычетаем, т.к. нужно сузить круг (-offsetY)
        let y      = cy + sin * (ph + this.radius)- offsetY//таким образом по умолчанию координаты окружности будут совпадать с центром cnv
        //по ширине прибавляем


        //т.к. круги видны за сферой, мы должны их спрятать.
        //Поэтому рассчитаем расстояние от сферы до центра экрана.
        //Затем создадим условие, в котором будем рисовать только те сферы расстояние м/д которыми больше значения ph.
        //Потому что, ph именно то значение, которое отвечает за радиус пустоты в центре.
        let distToC = Math.hypot( x-cx, y - cy)//distanse to  center

        let optic  = sin * this.size * this.impact * .7

        let size   = this.size + optic

        //переменные,которые генерируют цвет
        let h      = this.angle //оттенок
        let s      = 100 //переменная насыщенности
        let l      = 50 //переменная яркости
        let color  = `hsl(${h}, ${s}%, ${l}%)`


        if(distToC > ph - 1 || sin > 0){ //чтобы убрать неточности в вычеслении, вычитаем -1 из ph, и тем самым уйдёт мерцание первого кольцевого круга
        ctx.fillStyle = color
        ctx.beginPath()
        //рисуем круг
        ctx.arc(x,y, size, 0, 2 * Math.PI) //начальный угол = 0, конечный угол в радианах = 2 * Math.PI
        //заливка круга
        ctx.fill()
    }
        this.angle = (this.angle + this.velocity) % 360
    }
}



//для хранения сфер нужен массив
let orbsList = []
    function createStardust(){
        for (let i = 0; i < cfg.orbsCount; i++){
        orbsList.push( new Orb() )
    }
}
createStardust()
//отображаем каждый элемент для каждого массива. Для этого создадим функцию.
function loop(){
    ctx.globalCompositeOperation = `normal`
    requestAnimationFrame(loop)

    ctx.fillStyle = `rgb(22, 22, 22)`
    ctx.fillRect(0, 0, cw, ch)

    ctx.globalCompositeOperation = `lighten` //такой режим будет смешивать оттенки 
    orbsList.map (e => e.refresh())
}
loop()


})();