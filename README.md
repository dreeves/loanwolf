Currently just a tool to facilitate arbitrary-share 2-person 
decision auctions (aka odd yootling).

TODO: port kibotzer.com/bidder to this?

## Motivating Case Study

Today we had an auction for if Bee would work on molecall.com with Danny. 
She ceded 35% of the decision (she'd "35% do it") and bid $180 to Danny's $160. 
(Bee bidding to not do it, Danny bidding to do it.) 
So that meant she won and paid $160*.35 = $56 to Danny. 
All great except Danny realized what he *meant* to do was 
multiply his bid by 1/.65 so that up to 160 is what he'd actually pay 
(and thus $86 is what he'd get paid if he lost).

I propose that in generalized yootling one should state one's bid as the 
{most you'll pay, what you'll get paid} 
pair (one is computable from the other).

So in this case Bee'd have bid 
"pay up to $63 to not have to do it, require $117 to do it". 

That works because she was ceding 35% of the decision and with her bid of 180 she'd 
either win and buy out Danny's 35% for his $179.99 (at most) times .35 = $63 
or she'd lose and Danny'd buy her 65% for $180 times .65 = $117.

## General Formula and Auction Mechanism

In general, for an auction where you have `r` of the decision 
(`r`=65% for Bee in this case), 
if you want to think in terms of paying at most `$PAY` then your bid is 
`{$PAY, $PAY*r/(1-r)}`. 
Or if you want to think in terms of getting paid `$GET` then your bid is 
`{$GET*(1-r)/r, $GET}`.

You convert a `{$PAY, $GET}` bid to Fair Market Value by taking 
`$GET/r` where `r` is that player's share. 
And it's the Fair Market Values you compare to see who won.

But equivalently (the math checks out!) you can just see if 
one person will pay more than the other needs to get paid.

So if Danny (`r`=35%) bids {pay $104, get $56} and Bee (`r`=65%) bids {pay $63, get $117} 
then the implied Fair Market Values are 
$56/.35 = $160 (Danny) and 
$117/.65 = $180 (Bee) 
but you can also just see that Danny's not willing to pay what Bee needs to get paid while 
Bee is in fact willing to pay what Danny needs to get paid.

## Special Cases

Notice that for r=.5, $PAY and $GET are equal 
so it doesn't matter which you think in terms of.

And for r=1, like if we'd bargled and you'd ceded none of the decision and wanted to be paid at least $200, you'd bid {$0, $200} (no chance of you having to pay) and if I wanted to pay up to $300 I'd bid {$300, $0} (no chance of me getting paid). So everything works nicely. Trying to think in terms of getting paid when you own none of the decision doesn't make sense and the formula yields division by zero, or, if you like, says you have to bid {$infinity, $1} if you want to get paid $1 which is guaranteed irrelevant because you bid infinity dollars and thus will win and be the one paying.

Or, out of purely mathematical curiosity, suppose you bid {$0, $infinity} i.e. "fuck no and fuck you and all your descendants for all time" and I bid {$infinity, $1} then we tie and the coin flip says either I pay you infinity dollars, in which case, fine, I guess? Or the coin flip says you win but have to pay me $1 which is pretty not ok, because it was bargling and you're having to pay $1 (which could've been *any* amount of money!) just to keep your own thingy or whatever it was. But more to the point, if you own 0% of the decision then your "get paid" number is necessarily $0 as long as your "pay" number is finite, and everything is fine again. So, yeah, real numbers only!