import 'package:flutter/material.dart';
import 'package:mobile/models/Plug.dart';
import 'package:mobile/models/Service.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/ScreenWidthButton.dart';


class PlugCard extends StatefulWidget {
  final Plug plug;

  const PlugCard({super.key, required this.plug});

  @override
  State createState() => _StatePlugCard();
}
class _StatePlugCard extends State<PlugCard>{
  bool pressed = false;

  List<Widget> _getServiceBubbles() {
    List<Widget> bubbles = [];

    return bubbles;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.all(10),
        child: Container(
            decoration: BoxDecoration(
              //TODO: make a dominant color picker of the icon to color the container
                color: PlugItStyle.cardColor,
                borderRadius: BorderRadius.circular(8)
            ),
            child: Row(
              children: [
                Expanded(
                    child: Column(
                      children: [

                        // Plug title
                        SizedBox(height: 10,),
                        Text("\"${widget.plug.name!}\"", style: PlugItStyle.subtitleStyle),
                        SizedBox(height: 20,),


                        // Service bubbles
                        Row(
                          children: _getServiceBubbles(),
                        ),


                        // Row(Last plug activation date and Activated checkmark)
                        Row (
                          children: [
                            const Text("Last activation: dd/mm/yyyy"),
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
    );

  }
}
