$(document).ready(function(){

  /**
  *
  * Déclaration des variables
  *
  */
  var $home = $('#home');
  var $shenron = $('#shenron');
  var $shenronBubble = $('#shenron_bubble');
  var $shenronBubbleContent = $('#shenron_bubble div');
  var $gridMorpion = $('#morpion');
  var $btnTortueGenial = $('.btn-tortue-genial');
  var $btnTrunks = $('.btn-trunks');
  var $btnSangoku = $('.btn-sangoku');
  var $btnChooseOtherEnemy = $('.btn-choose-other-ennemy');
  var $blocSelectWhosPlayFirst = $('#who-go-first');
  var $notif = $('#indicator .notif');
  var $btnResetGame = $('.btn-reset');
  var $gameOverTitle = $('#game-over h1');
  var $btnRejouer = $('#game-over .btn-rejouer');
  var $gameAndSelect = $('#game_and_select');
  var $personnage = $('#personnage');
  var $personnageImg = $('#personnage img');
  var $game = $('#game_wrapper');
  var $blocChoiceDifficulty = $('#bloc-choix-difficulte');
  var $grid = $('#grid-morpion');
  var $cells = $('.cell');
  var arrayCells = [$('.c1'), $('.c2'), $('.c3'), $('.c4'), $('.c5'), $('.c6'), $('.c7'), $('.c8'), $('.c9')];
  var $line1 = $('.line1');
  var $line2 = $('.line2');
  var $line3 = $('.line3');
  var $col1 = $('.col1');
  var $col2 = $('.col2');
  var $col3 = $('.col3');
  var $diag1 = $('.diag1');
  var $diag2 = $('.diag2');
  var $gameOver = $('#game-over');
  var playerTurn = 0; // 0 = moi / 1=ennemy
  var difficulty;
  var defaultImgTortueGenial = 'www/assets/pictures/muten-roshi.png';
  var defaultImgTrunks = 'www/assets/pictures/trunks.png';
  var defaultImgSangoku = 'www/assets/pictures/sangoku.png';
  var $endGameBubble = $('#end_game_bubble');


  /**
  *
  * Choix niveau de difficulté
  *
  */
  var easy = [$btnTortueGenial, 'easy'];
  var normal = [$btnTrunks, 'normal'];
  var hard = [$btnSangoku, 'hard'];
  var ArraySelectDifficulty = [easy, normal, hard];

  $.each(ArraySelectDifficulty, function(key, value){
    value[0].on('click', function(){
      difficulty = value[1];
    });
  });


  /**
  *
  * Animation au chargement de la page
  *
  */
  homeAnimation();
  levitate($shenron);


  /**
  *
  * Affichage de la page de jeu (Ennemy + grille)
  *
  */
  var tortueGenial = [$btnTortueGenial, defaultImgTortueGenial];
  var trunks = [$btnTrunks, defaultImgTrunks];
  var sangoku = [$btnSangoku, defaultImgSangoku];
  var ArrayCharacters = [tortueGenial, trunks, sangoku];

  $.each(ArrayCharacters, function(key, value){
    value[0].on('click', function(){
      console.log(difficulty);
      DisplayGameAndCharacter(value[1]);
    });
  });


  /**
  *
  * Retour au choix de l'adversaire
  *
  */
  $btnChooseOtherEnemy.on('click', function(){
    clearGrid();
    $blocSelectWhosPlayFirst.show();
    $gridMorpion.hide();
    $personnage.css('top', '100%');
    $home.fadeIn(800);
    clearGameOverDislay();
    $endGameBubble.hideEndGameBubble('right', ['0px', 600], ['20px', 400], ['100%', 600]);
  });


  /**
  *
  * Qui commence??
  *
  */
  $('.btn-who-begin').on('click', function(){
    turn = $(this).hasClass('btn-me') ? 0 : 1;

    setGame($(this), turn);
  });


  /**
  *
  * On reset le game en cours
  *
  */
  $btnResetGame.on('click', function(){
    clearGrid();
    $blocSelectWhosPlayFirst.fadeIn(800);
  });


  /**
  *
  * Le joueur coche la grille
  *
  */
  $grid.on('click', '.cell', function(){
    var $cell = $(this);
    $('#indicator h3').fadeOut(400);

    if($cell.hasClass('ticked')){
      $notif.html('Do you try to tick an already ticked cell??');
    }else{
      $notif.html('');
      if(playerTurn == 0){
        playerTurn = 1;
        $cell.html("<button class='btn-grid btn-primary'></button>");
        $cell.addClass('ticked 0');
        $notif.html('<span class="text-warning">Enemy\'s turn to play</span>');
        detectIfEndGame(0);
      }
    }
  });


  /**
  *
  * Déclenchement de l'action de l'IA 
  *
  */
  var triggerFirstIaAction = setInterval(findEmptyCellAndCheckIt ,3000);


  /**
  *
  * Le joueur choisis de rejouer après GameOver
  *
  */
  $btnRejouer.on('click', function(){
    clearGrid();
    $blocSelectWhosPlayFirst.fadeIn(800);
    clearGameOverDislay();

    if(difficulty === 'easy'){
      $personnage.transformation(defaultImgTortueGenial);
    } else if(difficulty === 'normal'){
      $personnage.transformation(defaultImgTrunks);
    } else {
      $personnage.transformation(defaultImgSangoku);
    }

    $endGameBubble.hideEndGameBubble('right', ['0px', 600], ['20px', 400], ['100%', 600]);
    
  });


  /**
  *
  * Fonction pour l'animation au chargement de la page
  *
  */
  function homeAnimation(){
    $shenron.animate({'top' : '10px'}, 1800, function(){
      $shenron.animate({'left' : '30%'}, 1000, function(){
        $shenronBubble.fadeIn(800, function(){
          $shenronBubble.animate({'height' : '190px'}, 800, function(){
            $shenronBubbleContent.fadeIn(1200, function(){
              $('h2', $blocChoiceDifficulty).fadeIn(1200, function(){
                $('.btn-tortue-genial').closest('.btn-container').fadeIn(800, function(){
                  $('.btn-trunks').closest('.btn-container').fadeIn(800, function(){
                    $('.btn-sangoku').closest('.btn-container').fadeIn(800, function(){
                      
                    });
                  });
                });
              })
            })
          });
        })
      });
    });
  }


  /**
  *
  * Fonction pour la lévitation de Shenron
  *
  */
  function levitate($element) {
    $element.animate({ 'top':'+=35' }, 1000);
    $element.animate({ 'top':'-=35' }, 1000, function(){
      levitate($element);
    });
  }


  /**
  *
  * Fonction pour l'affichage de la page de jeu (ennemy + grille)
  *
  */
  function DisplayGameAndCharacter(imgCharacter){
    $('.img-personnage').attr('src', imgCharacter);
    $home.fadeOut(800, function(){
      $gridMorpion.fadeIn(800);
      $personnage.animate({'top' : '0px'}, 800, function(){
        $personnage.animate({'top' : '50px'}, 300)
      });
    });
  }


  /**
  *
  * Fonction pour l'affichage de la grille de tic-tac-toe
  *
  */
  function setGame($elem, currentTurn){
    $('#who-go-first').hide();
    $game.fadeIn();
    playerTurn = currentTurn;
  }


  /**
  *
  * Fonction pour réinitialiser la grille en vue d'une nouvelle partie
  *
  */
  function clearGrid(){
    $('#indicator h3').show();
    $notif.text('');
    $('.cell', $grid)
      .removeClass('ticked')
      .children()
      .remove()
      .end()
      .removeClass('1 0');
      $game.hide();
  }



  /**
  *
  * Fonction pour détecter un vainqueur s'il y en a
  *
  */
  function detectIfEndGame(turn){
    var count = 9;

    $('.line1.' + turn).length === 3 && GameOverDisplayOnEndGame(turn);
    $('.line2.' + turn).length === 3 && GameOverDisplayOnEndGame(turn);
    $('.line3.' + turn).length === 3 && GameOverDisplayOnEndGame(turn);

    $('.col1.' + turn).length === 3 && GameOverDisplayOnEndGame(turn);
    $('.col2.' + turn).length === 3 && GameOverDisplayOnEndGame(turn);
    $('.col3.' + turn).length === 3 && GameOverDisplayOnEndGame(turn);

    $('.diag1.' + turn).length === 3 && GameOverDisplayOnEndGame(turn);
    $('.diag2.' + turn).length === 3 && GameOverDisplayOnEndGame(turn);
    

    // Gestion match nul
    $.each($cells, function(key, value){
      $(this).hasClass('ticked') && count--;
      count == 0 && GameOverDisplayOnEndGame('nul');
    })
  }


  /**
  *
  * Fonction pour l'animation lors du GameOver
  *
  */
  function GameOverDisplayOnEndGame(winner){
    clearGrid();
    $gameOverTitle.fadeIn(800, function(){
      $btnRejouer.fadeIn(800, function(){
        $(this).animate({'marginTop' : '0px'}, 400);
        $gameOverTitle.animate({'marginTop' : '110px'}, 400);
      });
    });

    if(winner == 0){
      $gameOverTitle.text('You win');

      if(difficulty === 'easy'){
        img = 'www/assets/pictures/tortue_loose.png';
        msg = '...';
        ennemy_name = 'Master Oroshi: ';
      } else if(difficulty === 'normal'){
        img = 'www/assets/pictures/trunks_looose.png';
        msg = 'I\'ll not let you go that easy!!!';
        ennemy_name = 'Trunks: ';
      } else {
        img = 'www/assets/pictures/goku_loose.png';
        msg = 'I want my revenge!!!';
        ennemy_name = 'Sangoku: ';
      }
    } else if(winner == 1) {
      $gameOverTitle.text('You Loose');

      if(difficulty === 'easy'){
        img = 'www/assets/pictures/tortue_win.png';
        msg = 'Too young boy... hihihi!!!';
        ennemy_name = 'Master Oroshi: ';
      } else if(difficulty === 'normal'){
        img = 'www/assets/pictures/trunks_win.png';
        msg = 'It seems like you\'re lacking of training!';
        ennemy_name = 'Trunks: ';
      } else {
        img = 'www/assets/pictures/goku_win.png';
        msg = 'I won!!';
        ennemy_name = 'Sangoku: ';
      }
    } else {
      $gameOverTitle.text('Draw');

      if(difficulty === 'easy'){
        img = 'www/assets/pictures/tortue_draw.png';
        msg = 'Ok, I will be serious now...';
        ennemy_name = 'Master Oroshi: ';
      } else if(difficulty === 'normal'){
        img = 'www/assets/pictures/trunks_draw.png';
        msg = 'Not bad.';
        ennemy_name = 'Trunks: ';
      } else {
        img = 'www/assets/pictures/goku_draw.png';
        msg = 'Lest\'s do it again!!!';
        ennemy_name = 'Sangoku: ';
      }
    }

    $personnage.transformation(img, function(){
      $endGameBubble.displayEndGameBubble('right', ['70%', 600], ['110px', 400], ['450px', 1000], function(){
        $(this).displayBubbleMessages('special', ennemy_name, msg, "420px", 2000, function(){

        });
      });
    });
  }


  /*
  *
  * Animation pour chargement d'une nouvelle image
  *
  */
  $.fn.transformation = function(newImage, callback){
    return this.each(function(){
      $(this).fadeOut(1200, function(){
        $(this).fadeIn(1500).find('img').attr('src', newImage);

        typeof callback == 'function' && callback.call(this);
      });
    });
  }


  /**
  *
  * Animation pour l'apparition de la bulle de l'ennemi (en fin de partie)
  *
  */    
  $.fn.displayEndGameBubble = function(whichBubble, posTop, posLeft, width, callback){
    return this.each(function(){
      paramAnimate1 = {};
      paramAnimate1[whichBubble] = posLeft[0]

      $(this).animate({'top' : posTop[0]}, posTop[1], function(){
        $(this).animate(paramAnimate1, posLeft[1], function(){
          $(this).animate({'width' : width[0]}, width[1], function(){
              typeof callback == 'function' && callback.call(this);
          });
        });
      });
    });
  }


  /*
  *
  * Animation du défilement des contenu texte des dialogue dans les bubbles
  *
  */
  $.fn.displayBubbleMessages = function(bubbleType, enemy_name, msg, startPosLeft, speed, callback){
    return this.each(function(){
      $bubble = $(this)

      $bubble.find('div p').show().find('.enemy_name').text(enemy_name).end().find('.parag').text(msg).end().css('left', startPosLeft).animate({'left' : '0px'}, speed, function(){
        typeof callback == 'function' && callback.call(this);
      });
    });
  }


  /*
  *
  * Animation pour le masquage de la bulle de l'ennemie
  *
  */
  $.fn.hideEndGameBubble = function(whichBubble, width, posLeft, posTop){
    return this.each(function(){
      paramAnimate1 = {};
      paramAnimate1[whichBubble] = posLeft[0];
      $bubble = $(this);

      $bubble.find('div p').fadeOut(800, function(){
        $bubble.find('div p').find('.enemy_name').text('').end().find('.parag').text('');
        $bubble.animate({'width' : width[0]}, width[1], function(){
          $bubble.animate(paramAnimate1, posLeft[1], function(){
            $bubble.animate({'top' : posTop[0]}, posTop[1]);
          });
        });
      });
    });
  }


  /**
  *
  * Fonction pour réinitialiser l'affichage des élements du GameOver
  *
  */
  function clearGameOverDislay(){
    $gameOverTitle.hide().css('margin-top', '0px');
    $btnRejouer.hide().css('margin-top', '250px');
  }


  /**
  *
  * Fonction pour cibler les cases à cocher (par l'IA) en fonction du niveau de difficulté
  *
  */
  function findEmptyCellAndCheckIt(){
    var availableCells = [];
    var defense = 0; // cocher de manière à empecher le joueur de gagner
    var attack = 1; // cocher de manière à gagner
    var strategic = true; // cocher de manière à gagner

    $.each($cells, function(key, value){
      !$(this).hasClass('ticked') && availableCells.push(key);
    })

    var indexAleat = Math.round(Math.floor(Math.random() * availableCells.length));
    var cellProtect = findCellToCheck(defense);
    var cellAttack = findCellToCheck(attack);

    if (difficulty === 'easy'){
      cellToCheck = availableCells[indexAleat];

    } else if(difficulty === 'normal') {
      cellToCheck = !cellProtect ? availableCells[indexAleat] : cellProtect;

    } else {

      if($('.cell.ticked').length <= 1 && !arrayCells[4].hasClass('ticked')){
        cellToCheck = 4;
      } else {
        if(!cellProtect && !cellAttack){
          cellToCheck = findCellToCheck(attack, strategic) !== false ? findCellToCheck(attack, strategic) : availableCells[indexAleat];
        } else {
          cellToCheck = !cellAttack ? cellProtect : cellAttack;
        }
      }

    }

    ennemyChecksCell(arrayCells[cellToCheck]);
  }


  /**
  *
  * Fonction pour retourner un index de la grille, à cocher
  *
  */
  function findCellToCheck(playerId, strategic){
    var arr = [];

    returnRightIndex(playerId, 'line1', strategic) !== false && arr.push(returnRightIndex(playerId, 'line1', strategic));
    returnRightIndex(playerId, 'line2', strategic) !== false && arr.push(returnRightIndex(playerId, 'line2', strategic));
    returnRightIndex(playerId, 'line3', strategic) !== false && arr.push(returnRightIndex(playerId, 'line3', strategic));

    returnRightIndex(playerId, 'col1', strategic) !== false && arr.push(returnRightIndex(playerId, 'col1', strategic));
    returnRightIndex(playerId, 'col2', strategic) !== false && arr.push(returnRightIndex(playerId, 'col2', strategic));
    returnRightIndex(playerId, 'col3', strategic) !== false && arr.push(returnRightIndex(playerId, 'col3', strategic));

    returnRightIndex(playerId, 'diag1', strategic) !== false && arr.push(returnRightIndex(playerId, 'diag1', strategic));
    returnRightIndex(playerId, 'diag2', strategic) !== false && arr.push(returnRightIndex(playerId, 'diag2', strategic));

    return arr.length ? arr[0] : false;
  }


  /**
  *
  * Fonction pour parcourrir chaque eléments de la grille (line, col, diag), et retourner un bon index à cocher
  *
  */
  function returnRightIndex(playerId, elementOfGrid, strategic){
    var arr = [];

    nb_cell_check = strategic ? 1 : 2;

    if($('.' + elementOfGrid + '.' + playerId).length === nb_cell_check && $('.' + elementOfGrid + '.ticked').length === nb_cell_check) {
      $.each($('.' + elementOfGrid), function(key, value){
        !$(this).hasClass('ticked') && arr.push($(this).attr('index'));
      })
    }

    return arr.length ? arr[0] : false;
  }



  /**
  *
  * Fonction pour déclencher le cochage de la grille par l'IA
  *
  */
  function ennemyChecksCell($cellule){
    if(playerTurn == 1){
      playerTurn = 0;
      $cellule.html("<button class='btn-grid btn-warning'></button>").fadeOut().fadeIn();
      $cellule.addClass('ticked 1');
      $notif.html('<span class="text-info">Your turn to play</span>');

      detectIfEndGame(1);
    }
  }


});
