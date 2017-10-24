(function($) {
  const theForm = $('#star');
  const list=$('#star li');
  const film_name=$('#star input');
  const scoreele=$('.info .score');


  theForm.submit((e) => {
    e.preventDefault();
    let score=0;
    for (let i = 0; i < list.length; i++) {
        if(list[i].className == "light") score++;
    }

    let obj={
        film_name:film_name.val(),
        score:score
    };

    $.ajax({
      type: "POST",
      url: "/score_submit",
      data: JSON.stringify(obj),
      success: function(film) {
        scoreele.html("Score: "+film.score);
      },
      contentType: "application/json",
      dataType: "json"
    });
  });
})(jQuery); // jQuery is exported as $ and jQuery