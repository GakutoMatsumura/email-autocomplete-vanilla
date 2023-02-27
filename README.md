# email-autocomplete-vanilla.js
 Vanilla JS version of email-autocomplete that suggests and autocompletes domains as the user types in the email address field.

----
email-autocomplete, Vanilla JS full-remake.

## What is this?
----
This javascript is a full-remake of [Low Yong Zhen's](https://github.com/yongzhenlow/email-autocomplete) 1.3.0 contents into Vanilla JS (pure javascript) that does not depend on jQuery.


## What does it do?
----
If the user types "user@gm", the script suggests: "user@gmail.com", based on the first result from the list of predefined email domains.

----

### Download
Download or clone this repo and copy dist/email-autocomplete-vanilla.min.js into your javascripts directory.


## Usage
----
```javascript
<script src="email-autocomplete-vanilla.min.js"></script>
```

```html
<input id="target_input_id" name="email" type="email">
```

```html
<script>
document.addEventListener("DOMContentLoaded", function(e) {
	emailautocomplete("#target_input_id", {
		domains: ["gmail.com","icloud.com"],
		suggClass: "custom-classname",
		suggBkColor: "inherit"
	});
});
</script>
```

## Settings
----
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| suggClass | string | 'eac-sugg' | Classname for the suggestion text element. |
| domains | array | See list of domains below | Array of domains used for autocompleting. |

## Styling
----
Use the following CSS to style the suggestion text color. Remember to update the classname if you've changed it to a custom one.

```css
.eac-sugg {
	color: #ccc;
}
```

## domains
----
These are the plugin default domains if the domains option is not supplied.

* yahoo.co.jp
* gmail.com
* ezweb.ne.jp
* au.com
* docomo.ne.jp
* i.softbank.jp
* softbank.ne.jp
* excite.co.jp
* googlemail.com
* hotmail.co.jp
* hotmail.com
* icloud.com
* live.jp
* me.com
* mineo.jp
* nifty.com
* outlook.com
* outlook.jp
* yahoo.ne.jp
* ybb.ne.jp
* ymobile.ne.jp

## Author
----
### Remake via Vanilla JS base
* Gakuto Matsumura

### Origin
* Low Yong Zhen
thank you.

## LICENSE
----
MIT License

