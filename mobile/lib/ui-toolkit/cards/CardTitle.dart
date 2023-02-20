import 'package:flutter/material.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/IconButtonSwitch.dart';


class CardTitle extends StatefulWidget {
  final String label;
  final bool state;
  final TextStyle style;
  final List<Widget> children;
  final void Function()? onPressed;
  final void Function()? onIconPressed;
  final bool isIconButtonPresent;
  final Icon iconButton;

  const CardTitle({super.key,
    this.label = "",
    this.onPressed,
    this.children = const [],
    this.state = true,
    this.style = PlugItStyle.subtitleStyle,
    this.isIconButtonPresent = false,
    this.iconButton = const Icon(Icons.delete),
    this.onIconPressed,
  });

  @override
  State createState() => _StateCardTitle();
}
class _StateCardTitle extends State<CardTitle>{
  bool pressed = false;
  bool deployed = false;

  void onTap(bool value) {
    setState(() {
      pressed = true;
    });
  }

  void onEnd() {
    if (pressed == true) {
      setState(() {
        widget.onPressed!();
        deployed != deployed;
        pressed = false;
      });
    }
  }
  @override
  void initState() {
    deployed = widget.state;
    super.initState();
  }

  Widget getCardTitle(height)
  {
    return GestureDetector(
        onTap: () => onTap(!widget.state),
        child: AnimatedContainer(
            height: height * 0.07,
            duration: const Duration(milliseconds: 200),
            onEnd: onEnd,
            decoration: BoxDecoration(
                color: (!pressed) ? PlugItStyle.primaryColor : PlugItStyle.buttonColorPressed,
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: Colors.black12),
            ),
            child: Row(
              children: [
                Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 10),
                    child:Text(widget.label, style: widget.style)
                ),
                (widget.state)
                    ? const Icon(Icons.keyboard_arrow_up_rounded)
                    : const Icon(Icons.keyboard_arrow_down_rounded),
                (widget.isIconButtonPresent)
                    ? const SizedBox(width: 50,)
                    : const SizedBox(width: 0,),
                (widget.isIconButtonPresent)
                    ? IconButton(
                      onPressed: widget.onIconPressed!,
                      icon: widget.iconButton)
                    : const SizedBox(width: 0,),
              ],
            )
        )
    );
  }

  @override
  Widget build(BuildContext context) {
    var height = MediaQuery.of(context).size.height;
    return Column(
          children:
            (widget.state) ? [
              getCardTitle(height),
              ...widget.children
            ] : [
              getCardTitle(height)
            ]
   );
  }
}
