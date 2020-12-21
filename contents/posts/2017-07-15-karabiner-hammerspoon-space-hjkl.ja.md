---
title: Karabiner-ElementsとHammerspoonを使ってSpace+hjklでキー移動する
category: 'development'
keywords: ['環境構築', 'Karabiner-Elements', 'Hammerspoon']
---

KarabinerのVi mode extraに入っている「Spaceとhjkl同時押しでカーソル移動する」機能をMacOS Sierraでも使えるようにしたので、設定ファイルを公開する。

まずKarabiner-Elementsを使ってSpaceと何かのキーの同時押しをControlキーにマッピングする。次にHammerspoonでControl+hjklをカーソルキーに割り当てる。Karabiner-Elementsだけでキー移動をマッピングしたところ、カーソルが見えないくらい早く移動して使いづらかったので、2つのアプリケーションを使う複雑な設定になってしまった。

## ~/.config/karabiner/karabiner.json

注意: Commandキーを英数/かなにマッピングする設定と、Capslockを単体のときはEscape, 何かのキーと同時押しのときはControlにマッピングする設定も含まれています。"rules":以下を読んで必要なものを選んで使ってください。

```javascript
{
    "global": {
        "check_for_updates_on_startup": true,
        "show_in_menu_bar": true,
        "show_profile_name_in_menu_bar": false
    },
    "profiles": [
        {
            "complex_modifications": {
                "parameters": {
                    "basic.to_if_alone_timeout_milliseconds": 1000
                },
                "rules": [
                    {
                        "description": "Change left/right_command to eisu/kana if pressed alone.",
                        "manipulators": [
                            {
                                "from": {
                                    "key_code": "left_command",
                                    "modifiers": {
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "key_code": "left_command"
                                    }
                                ],
                                "to_if_alone": [
                                    {
                                        "key_code": "japanese_eisuu"
                                    }
                                ],
                                "type": "basic"
                            },
                            {
                                "from": {
                                    "key_code": "right_command",
                                    "modifiers": {
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "key_code": "right_command"
                                    }
                                ],
                                "to_if_alone": [
                                    {
                                        "key_code": "japanese_kana"
                                    }
                                ],
                                "type": "basic"
                            }
                        ]
                    },
                    {
                        "description": "Change spacebar to left_control. (Post spacebar if pressed alone)",
                        "manipulators": [
                            {
                                "from": {
                                    "key_code": "spacebar",
                                    "modifiers": {
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "key_code": "left_control"
                                    }
                                ],
                                "to_if_alone": [
                                    {
                                        "key_code": "spacebar"
                                    }
                                ],
                                "type": "basic"
                            }
                        ]
                    },
                    {
                        "description": "Change caps_lock to control if pressed with other keys, to escape if pressed alone.",
                        "manipulators": [
                            {
                                "from": {
                                    "key_code": "caps_lock",
                                    "modifiers": {
                                        "optional": [
                                            "any"
                                        ]
                                    }
                                },
                                "to": [
                                    {
                                        "key_code": "left_control"
                                    }
                                ],
                                "to_if_alone": [
                                    {
                                        "key_code": "escape"
                                    }
                                ],
                                "type": "basic"
                            }
                        ]
                    }
                ]
            },
            "devices": [],
            "fn_function_keys": {
                "f1": "display_brightness_decrement",
                "f10": "mute",
                "f11": "volume_decrement",
                "f12": "volume_increment",
                "f2": "display_brightness_increment",
                "f3": "mission_control",
                "f4": "launchpad",
                "f5": "illumination_decrement",
                "f6": "illumination_increment",
                "f7": "rewind",
                "f8": "play_or_pause",
                "f9": "fastforward"
            },
            "name": "Default profile",
            "selected": true,
            "simple_modifications": {},
            "standalone_keys": {
                "left_command": "japanese_eisuu",
                "right_command": "japanese_kana"
            },
            "virtual_hid_keyboard": {
                "caps_lock_delay_milliseconds": 0,
                "keyboard_type": "ansi"
            }
        }
    ]
}
```

## ~/.hammerspoon/init.lua

```lua
local function keyCode(key, modifiers)
   modifiers = modifiers or {}
   return function()
      hs.eventtap.event.newKeyEvent(modifiers, string.lower(key), true):post()
      hs.timer.usleep(1000)
      hs.eventtap.event.newKeyEvent(modifiers, string.lower(key), false):post()
   end
end

local function remapKey(modifiers, key, keyCode)
   hs.hotkey.bind(modifiers, key, keyCode, nil, keyCode)
end

remapKey({'ctrl'}, 'h', keyCode('left'))
remapKey({'ctrl'}, 'j', keyCode('down'))
remapKey({'ctrl'}, 'k', keyCode('up'))
remapKey({'ctrl'}, 'l', keyCode('right'))
remapKey({'ctrl', 'shift'}, 'h', keyCode('left', {'shift'}))
remapKey({'ctrl', 'shift'}, 'j', keyCode('down', {'shift'}))
remapKey({'ctrl', 'shift'}, 'k', keyCode('up', {'shift'}))
remapKey({'ctrl', 'shift'}, 'l', keyCode('right', {'shift'}))
remapKey({'ctrl', 'cmd'}, 'h', keyCode('left', {'cmd'}))
remapKey({'ctrl', 'cmd'}, 'j', keyCode('down', {'cmd'}))
remapKey({'ctrl', 'cmd'}, 'k', keyCode('up', {'cmd'}))
remapKey({'ctrl', 'cmd'}, 'l', keyCode('right', {'cmd'}))
remapKey({'ctrl', 'shift', 'cmd'}, 'h', keyCode('left', {'shift', 'cmd'}))
remapKey({'ctrl', 'shift', 'cmd'}, 'j', keyCode('down', {'shift', 'cmd'}))
remapKey({'ctrl', 'shift', 'cmd'}, 'k', keyCode('up', {'shift', 'cmd'}))
```
