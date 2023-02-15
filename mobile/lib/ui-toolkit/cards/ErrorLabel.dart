import 'package:flutter/material.dart';

import 'package:mobile/ui-toolkit/PlugItStyle.dart';

enum Level {
  error,
  warning
}

class ErrorCard extends StatefulWidget {
  final String errorMessage;
  final Level errorLevel;
  final bool big;
  final bool showIcon;
  final bool showContainer;

  const ErrorCard({super.key, required this.errorMessage, this.errorLevel = Level.error, this.big = false, this.showIcon = true, this.showContainer = false});

  @override
  State createState() => _StateErrorCard();
}
class _StateErrorCard extends State<ErrorCard>{

  Widget getIcon() {
    if (!widget.showIcon) {
      return const SizedBox(width: 10);
    }
    switch (widget.errorLevel) {
      case Level.error:
        return const Icon(Icons.error, color: Colors.red);
      case Level.warning:
        return const Icon(Icons.warning, color: Colors.orange);
    }
  }

  Widget getMessage() {
    switch (widget.errorLevel) {
      case Level.error:
        return Text(widget.errorMessage, style: (!widget.big) ? PlugItStyle.smallStyleError: PlugItStyle.subtitleStyleError);
      case Level.warning:
        return Text(widget.errorMessage, style: (!widget.big) ? PlugItStyle.smallStyleWarning: PlugItStyle.subtitleStyleWarning);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 15),
        child: Container(
            decoration: BoxDecoration(
                color: (widget.showContainer) ? Colors.grey[300] : Colors.transparent,
                borderRadius: BorderRadius.circular(5)
            ),
            child: Row(
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 10),
                  child: getIcon(),
                ),
                getMessage()
              ],
            )
        )
    );

  }
}
