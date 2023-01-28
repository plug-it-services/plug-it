import 'package:flutter/material.dart';
import 'package:mobile/models/Plug.dart';
import 'package:mobile/models/Service.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/ScreenWidthButton.dart';


class PlugCard extends StatefulWidget {
  final Plug plug;
  final void Function()? callback;

  const PlugCard({super.key, required this.plug, this.callback});

  @override
  State createState() => _StatePlugCard();
}
class _StatePlugCard extends State<PlugCard>{
  bool pressed = false;


  List<Widget> _getServiceBubbles() {
    List<Widget> bubbles = [];
    int idx = 0;

    for (String icon in widget.plug.icons!) {
      if (idx >= 4 && widget.plug.icons!.length > 5) {
        break;
      }
      bubbles.add(Container(
        width: 12,
        height: 12,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(100),
          color: PlugItStyle.foregroundColor,
          border: Border.all(color: Colors.black)
        ),
        child: Image.network(
            icon,
            width: 10,
            height: 10,
        )
      ));
      if (idx + 1 < widget.plug.icons!.length && idx + 1 <= 4) {
        bubbles.add(const Divider());
      }
      idx++;
    }
    if (widget.plug.icons!.length > 5) {
      var moreLen = 4 - widget.plug.icons!.length;
      bubbles.add(Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(100),
              color: PlugItStyle.foregroundColor,
              border: Border.all(color: Colors.black)
          ),
          child: Text("+$moreLen"),
      ));
    }
    return bubbles;
  }

  void _onTap() {
    setState(() {
      pressed = true;
    });
  }

  void _onEnd() {
    setState(() {
      pressed = false;
    });
    widget.callback!();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.all(10),
        child: GestureDetector(
          onTap: _onTap,
          child: AnimatedContainer(
              onEnd: _onEnd,
              duration: const Duration(milliseconds: 200),
              decoration: BoxDecoration(
                //TODO: make a dominant color picker of the icon to color the container
                  color: (!pressed) ? PlugItStyle.cardColor : PlugItStyle.buttonColorPressed,
                  borderRadius: BorderRadius.circular(8)
              ),
              child: Row(
                children: [
                  Expanded(
                      child: Column(
                        children: [
                          const SizedBox(height: 10,),

                          // Plug title
                          Text("\"${widget.plug.name!}\"", style: PlugItStyle.subtitleStyle),
                          const SizedBox(height: 20,),


                          // Service bubbles
                          Row(
                            children: _getServiceBubbles(),
                          ),
                          const SizedBox(height: 20,),


                          // Row(Last plug activation date and Activated checkmark)
                          Row (
                            children: [
                              const Text("Last activation: dd/mm/yyyy"),
                              const SizedBox(width: 10,),
                              Checkbox(value: widget.plug.activated ?? false, onChanged: (value) {
                                //TODO: disable plug
                                setState(() {
                                  widget.plug.activated = value;
                                });
                              },),
                            ]
                          )
                        ],
                      )
                  )
                ],
              )
          )
        )
    );

  }
}
