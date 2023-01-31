import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';
import 'package:mobile/models/plug/Plug.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:transparent_image/transparent_image.dart';


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

    for (String icon in widget.plug.icons) {
      if (idx >= 4 && widget.plug.icons.length > 5) {
        break;
      }

      bubbles.add(Container(
        width: 46,
        height: 46,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(100),
          color: PlugItStyle.foregroundColor,
          border: Border.all(color: Colors.black)
        ),
        child: CachedNetworkImage(
          imageUrl: "${PlugApi.assetsUrl}/$icon",
          placeholder: (context, url) => const CircularProgressIndicator(),
          errorWidget: (context, url, error) => const Icon(Icons.error, color: Colors.black),
          width: 44,
          height: 44,
        ),
      ));
      if (idx + 1 < widget.plug.icons.length && idx + 1 <= 4) {
        bubbles.add(const SizedBox(width: 20,));
      }
      idx++;
    }
    if (widget.plug.icons.length > 5) {
      var moreLen = 4 - widget.plug.icons.length;
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
    final double height = MediaQuery.of(context).size.height;
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
              child: MediaQuery.removePadding(
                  context: context,
                  removeTop: true,
                  child: Column(
                    children: [
                        const SizedBox(height: 10,),

                        // Plug title
                        Text("\"${widget.plug.name}\"", style: PlugItStyle.subtitleStyle),
                        // Service bubbles
                        const SizedBox(height: 20,),

                        Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: _getServiceBubbles(),
                        ),
                        const SizedBox(height: 20,),
                        // const SizedBox(height: 20,),


                        // Row(Last plug activation date and Activated checkmark)
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text("Last activation: dd/mm/yyyy"),
                            //const SizedBox(height: 0,),
                            Checkbox(value: widget.plug.enabled, onChanged: (value) {
                              setState(() {
                                widget.plug.enabled = value ?? false;
                                PlugApi.enablePlug(widget.plug.id, widget.plug.enabled);
                              });
                            },),
                          ]
                        )
                      ],
                )
              )
            )
          )
    );

  }
}
