$(document).ready(function () {
  let buttonColours = ["red", "blue", "green", "yellow"];
  let gamePattern = [];
  let userClickedPattern = [];

  let started = false;
  let level = 0;
  let highScore = 0;

  let redSound = new Audio("sounds/red.mp3");
  let blueSound = new Audio("sounds/blue.mp3");
  let greenSound = new Audio("sounds/green.mp3");
  let yellowSound = new Audio("sounds/yellow.mp3");
  let wrongSound = new Audio("sounds/wrong.mp3");

  // Start the game when the screen is touched on mobile devices
  $(document).on("click touchstart", function () {
    if (!started) {
      $("#level-title").text("Level " + level);
      nextSequence();
      started = true;
    }
  });

  $(".btn").on("click touchstart", function (event) {
    event.preventDefault(); // Prevent the default behavior of the touch event
    if (started && !$("#game-over-modal").is(":visible") && !isPlayingSequence) {
      let userChosenColour = $(this).attr("id");
      userClickedPattern.push(userChosenColour);

      playSound(userChosenColour);
      animatePress(userChosenColour);

      checkAnswer(userClickedPattern.length - 1);
    }
  });

  function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
      if (userClickedPattern.length === gamePattern.length) {
        setTimeout(function () {
          nextSequence();
        }, 1000);
      }
    } else {
      playSound("wrong");
      $("body").addClass("game-over");
      $("#level-title").text("Game Over");
      $("#score").text(level); // Display the score in the modal

      if (level - 1 > highScore) {
        highScore = level - 1;
      }

      // Show the Game Over modal
      $("#game-over-modal").css("display", "block");

      // Stop the game from showing a sequence in the background
      isPlayingSequence = false;

      startOver();
    }
  }

  // Add a new variable to track whether the game is currently playing the sequence
  let isPlayingSequence = false;

  function nextSequence() {
    // Check if the manual is displayed, or if the game is over, or if a sequence is already playing
    if (
        $("#manual-modal").css("display") === "block" ||
        $("#game-over-modal").css("display") === "block" ||
        isPlayingSequence
    ) {
      return;
    }

    userClickedPattern = [];
    level++;
    $("#level-title").text("Level " + level);

    // Generate and add a new color to the game pattern
    let randomNumber = Math.floor(Math.random() * 4);
    let randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    // Set a flag to indicate that the sequence is being played
    isPlayingSequence = true;

    // Play the entire sequence
    playSequence(0);
  }


    function playSequence(index) {
      if (index < gamePattern.length) {
        setTimeout(function () {
          let currentColor = gamePattern[index];
          $("#" + currentColor).fadeIn(100).fadeOut(100).fadeIn(100);
          playSound(currentColor);
          playSequence(index + 1);
        }, 500); // Reduced delay time to 500 milliseconds
      } else {
        // After playing the sequence, allow user input
        isPlayingSequence = false;
        $("#level-title").text("Your Turn");
      }
    }


    function animatePress(currentColor) {
      $("#" + currentColor).addClass("pressed");
      setTimeout(function () {
        $("#" + currentColor).removeClass("pressed");
      }, 100);
    }

    function playSound(name) {
      switch (name) {
        case "red":
          redSound.play();
          break;
        case "blue":
          blueSound.play();
          break;
        case "green":
          greenSound.play();
          break;
        case "yellow":
          yellowSound.play();
          break;
        case "wrong":
          wrongSound.play();
          break;
        default:
          break;
      }
    }

    function startOver() {
      level = 0;
      gamePattern = [];
      started = false;
    }

    // Event listener for the "Restart" button in the Game Over modal
    $("#restart-btn").on("click", function () {
      closeModal(); // Close the Game Over modal
      initGame(); // Restart the game
    });

    function initGame() {
      userClickedPattern = [];
      gamePattern = [];
      level = 0;
      started = false;
    }

    // Function to close the Game Over modal
    function closeModal() {
      $("#game-over-modal").css("display", "none");
    }

  // Function to show the manual modal
  function showManual() {
    $("#manual-modal").css("display", "block");
  }

// Function to close the manual modal
  function closeManual() {
    $("#manual-modal").css("display", "none");
  }

// Event listener for the "Show Manual" button
  $("#manual-button").on("click", function () {
    showManual();
  });

// Event listener for the "Close" button in the manual modal
  $("#close-manual-btn").on("click", function () {
    closeManual();
  });
});
