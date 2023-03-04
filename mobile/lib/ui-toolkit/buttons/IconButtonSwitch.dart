import 'package:flutter/material.dart';

class IconButtonSwitch extends StatefulWidget {
  final void Function(bool value)? onChange;
  final Icon falseIcon;
  final Icon trueIcon;
  final bool state;

  const IconButtonSwitch(
      {super.key,
      required this.falseIcon,
      required this.trueIcon,
      this.onChange,
      this.state = false});

  @override
  State createState() => _StateIconButtonSwitch();
}

class _StateIconButtonSwitch extends State<IconButtonSwitch> {
  bool state = false;
  bool changed = false;

  void onTap() {
    setState(() {
      changed = true;
      state = !state;
      widget.onChange!(state);
    });
  }

  void onEnd() {}

  @override
  void initState() {
    super.initState();
    state = widget.state;
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
            onEnd: onEnd,
            duration: const Duration(milliseconds: 200),
            child: state ? widget.trueIcon : widget.falseIcon));
  }
}
