```java
public class GameProcess {
  public final static int START_NEW = 0;
	public final static int RESUME = 1;
  public final static int NO_MONEY = 2;
  public final static int GAME_OVER = 3;
}

public class ValueCountStatus {
  public final static int NORMAL = 0;
  public final static int BUST = 1;
  public final static int BLACKJACK = 2;
}

public class PlayerAction {
  public final static int HIT = 0;
  public final static int STAND = 1;
}

public class GameResult {
  public final static int PLAYER_WIN = 0;
  public final static int DEALER_WIN = 1;
  public final static int DRAW = 2;
  public final static int PUSH = 3;
}

public class BetStatus {
  public final static int INVALID_TYPE = 0;
  public final static int INVALID_AMOUNT = 1;
  public final static int VALID = 2;
}

public class Status {
  public final static int SUCCESS = 0;
  public final static int Fail = -1;
}

```



### 开始游戏

Path:  `/hostname/game/start?name=jdy&id=12345678` 

Method:  `GET`

Response Body:

```json
{
    "game_identity": 1668568244,
    "status": 0,
    "player_name": "jdy",
    "balance": 2500
 }
```



---

### 继续游戏

Path: `/hostname/game/resume?name=jdy&id=123456`

Method: `GET`

Response Body:

```json
{
    "game_identity": 1668568244,
    "status": 1,
    "player_name": "jdy",
  	"bet": 100,
    "balance": 2400
}
```



---

### 设置筹码

Path: `/hostname/game/set_bet`

Method: `POST`

Request Body:

```json
{
    "player_name": "jdy",
    "game_identity": 1668568244,
    "bet": 100
}
```

Response Body:

```json
{
    "player_name": "jdy",
    "game_identity": 1668568244,
    "bet": 100,
    "balance": 2400
}
```



---

### 发牌

Path: `/hostname/game/deal`

Method: `POST`

Request Body:

```json
{
  	"player_name": "jdy",
  	"game_identity": 1668568244
}
```

Response Body:

```json
{
  	"player_name": "jdy",
  	"game_identity": 1668568244,
  	"player_hands": {
    		"card": {
  					"suit": "♦️",
  					"rank": "2",
  					"value": 2
				},
				"card": {
          	"suit": "♠️",
          	"rank": "Jack",
          	"value": 10
        }
  	},
  	"player_value": 12,
		"dealer_hands": {
   			"card": {
  					"suit": "❤️",
  					"rank": "Ace",
  					"value": [
              1,
              11
            ]
				}
    },
  	"value_count_status": 0
}
```



---

### Hit

Path: `localhost/game/hit`

Method: `POST`

Request Body:

```json
{
  	"player_name": "jdy",
  	"game_identity": 1668568244,
  	"player_value": 12,
  	"player_hands": {
    		"card": {
  					"suit": "♦️",
  					"rank": "2",
  					"value": 2
				},
				"card": {
          	"suit": "♠️",
          	"rank": "Jack",
          	"value": 10
        }
  	},
  	"player_action": 0
}
```

Response Body:

```json
{
  	"player_name": "jdy",
  	"game_identity": 1668568244,
  	"player_value": 22,
  	"player_hands": {
    		"card": {
  					"suit": "♦️",
  					"rank": "2",
  					"value": 2
				},
				"card": {
          	"suit": "♠️",
          	"rank": "Jack",
          	"value": 10
        },
      	"card": {
          	"suit": "❤️",
          	"rank": "King",
          	"value": 10
        },
  	},
  	"value_count_status": 1
}
```



---

### Stand

Path: `localhost/game/stand`

Method: `POST`

Request Body:

```json
{
  	"player_name": "jdy",
  	"game_identity": 1668568244,
  	"player_value": 18,
  	"player_action": 1
}
```

Response Body:

```json
{
		"player_name": "jdy",
		"game_identity": 1668568244,
  	"player_value": 18,
  	"player_hands": {
				"card": {
          	"suit": "♠️",
          	"rank": "8",
          	"value": 8
        },
      	"card": {
          	"suit": "❤️",
          	"rank": "Queen",
          	"value": 10
        }
  	},
  	"player_action": 1,
  	"value_count_status": 0,
  	"dealer_hands": {
      	"card": {
          	"suit": "♦️",
          	"rank": "8",
          	"value": 8
        },
      	"card": {
          	"suit": "♠️",
          	"rank": "5",
          	"value": 5
        },
    		"card": {
          	"suit": "♣️",
          	"rank": "3",
          	"value": 3
        },
      	"card": {
          	"suit": "方块",
          	"rank": "king",
          	"value": 10
        }
    },
  	"game_result": 1,
  	"balance": 2600
}
```





