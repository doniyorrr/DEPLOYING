window.addEventListener("load" , function(){
    let sale = document.querySelectorAll(".sale")
    let salePrice = document.querySelectorAll(".sale_price")

    // console.log(sale);

    sale.forEach((element , index) =>{
        if(element.innerHTML == ""){
            element.style.display = "none"
            salePrice[index].style.display = "none"
        }
    })


    // fetch("https://cbu.uz/oz/arkhiv-kursov-valyut/json/" , {
    //     "Access-Control-Allow-Origin": "*"
    // })
    // .then(data =>console.log(data))
    const cardProduct = document.querySelectorAll(".card_img");

    cardProduct.forEach(element =>{
        element.addEventListener("click" ,()=>{
            let userID = $(element).attr("userId");
            // console.log(userID)
            window.location.href = userID
        })
    })

    const writeLike = document.querySelectorAll(".writeLike");
    const like = document.querySelectorAll(".like");
    
    like.forEach((element , value ) =>{
        element.addEventListener("click" , (e)=>{
            let userID = $(element).attr("userId")
            console.log(userID);
            fetch(userID , {
                method:"POST"
            })
            .then(data => data.json())
            .then(data =>{
                writeLike.forEach((elem , val )=>{
                    if(val == value){
                        elem.innerHTML = data.like
                        console.log(elem);
                    }
                })
            })
        })
    })

})

