async function loadLatestQuestions(){

    const container = document.getElementById("latestQuestions");

    if(!container){
        alert("latestQuestions DIV NOT FOUND");
        return;
    }

    try{

        alert("Fetching JSON...");

        const response = await fetch("database/index.json");

        alert(response.status);

        const data = await response.json();

        console.log(data);

        container.innerHTML="";

        data.forEach(item=>{

            container.innerHTML+=`
            <div class="question-card">
                <h3>${item.title}</h3>
            </div>
            `;

        });

    }catch(error){

        alert(error);

        console.log(error);

    }

}
