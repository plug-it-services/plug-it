import 'package:flutter/material.dart';
import 'package:mobile/ui-toolkit/PlugItStyle.dart';


class ScreenWidthButton extends StatefulWidget {
  final String label;
  final double size;
  final Color? color;
  final double? height;
  final Color? pressedColor;
  final bool enabled;
  final void Function()? callback;

  const ScreenWidthButton({super.key, this.label = "", this.size = 15, this.callback, this.color, this.pressedColor, this.height, this.enabled = true});

  @override
  State createState() => _StateScreenWidthButton();
}
class _StateScreenWidthButton extends State<ScreenWidthButton>{
  bool pressed = false;

  void onTap() {
    if (!widget.enabled) {
      return;
    }
    setState(() {
      pressed = true;
    });
  }

  void onEnd() {
    if (!widget.enabled) {
      return;
    }
    if (pressed == true) {
      setState(() {
          widget.callback!();
          pressed = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 25),
            child: GestureDetector(
              onTap: onTap,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                onEnd: onEnd,
                height: widget.height ?? 55,
                decoration: BoxDecoration(
                  color: (!pressed) ? (widget.color ?? PlugItStyle.buttonColor) : (widget.pressedColor ?? PlugItStyle.buttonColorPressed),
                  border: Border.all(color: Colors.black),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                    child: Text(
                        widget.label,
                        style: TextStyle(color: Colors.white, fontSize: widget.size, fontWeight: FontWeight.bold)
                      ),
                    )
                ),
              ),
    );
  }
}
