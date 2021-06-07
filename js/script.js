const pokaWrappers = [].slice.call(document.querySelectorAll(".wrapper"));
const messages = [].slice.call(document.querySelectorAll(".wrapper"));

const clearVisibleClassFromPokaWrappers = () => {
  pokaWrappers.forEach((pokaWrapper) => {
    if (pokaWrapper.classList.contains('visible')) {
      pokaWrapper.classList.remove('visible') 
    }
  });
};

const addVisibleClassToPokaWrapper = (index) => {
  // clearVisibleClassFromPokaWrappers();
  if (!pokaWrappers[index].classList.contains("visible")) {
    pokaWrappers[index].classList.add("visible");
  }
};

const removeVisibleClassFromPokaWrapper = () => {
  if (pokaWrapper.classList.contains("visible")) {
    pokaWrapper.classList.remove("visible");
  }
};

const checkAndPlayPokaDotAnimation = () => {
  const scrollTop = ScollPostion()
  messages.forEach((message, index) => {
    const bounding = message.getBoundingClientRect();
    if (bounding.top >= 0 && bounding.top <= window.innerHeight) {
      addVisibleClassToPokaWrapper(index);
    }
    //   else {
    //   removeVisibleClassFromPokaWrapper();
    // }
  });
};

function ScollPostion() {
  var t, l, w, h;
  if (document.documentElement && document.documentElement.scrollTop) {
      t = document.documentElement.scrollTop;
      l = document.documentElement.scrollLeft;
      w = document.documentElement.scrollWidth;
      h = document.documentElement.scrollHeight;
  } else if (document.body) {
      t = document.body.scrollTop;
      l = document.body.scrollLeft;
      w = document.body.scrollWidth;
      h = document.body.scrollHeight;
  }
  return {
      top: t,
      left: l,
      width: w,
      height: h
  };
}


window.addEventListener("scroll", () => {
  if(document.documentElement.scrollTop > 200){
    $(".scrollTop-nav").addClass("home-nav");
  }else{
    $(".scrollTop-nav").removeClass("home-nav");
  }
  requestAnimationFrame(checkAndPlayPokaDotAnimation);
});

requestAnimationFrame(checkAndPlayPokaDotAnimation); 