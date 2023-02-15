import 'package:flutter/material.dart';

import 'package:mobile/models/field/Variable.dart';
import 'package:mobile/models/Event.dart';

import 'package:mobile/ui-toolkit/PlugItStyle.dart';


class VariableMenu extends StatefulWidget {
  final List<Event?> selectedPlugEvents;
  final int eventIdx;
  final void Function(Event, Variable, int idx) onVariableSelected;

  const VariableMenu({super.key,
    required this.onVariableSelected,
    required this.selectedPlugEvents,
    required this.eventIdx,
  });

  @override
  State createState() => _StateVariableMenu();
}
class _StateVariableMenu extends State<VariableMenu>{
  bool active = false;

  List<Widget> getEventVariables(int i, BuildContext context) {
    List<Widget> list = [];

    if (widget.selectedPlugEvents[i] == null || widget.selectedPlugEvents[i]!.variables.isEmpty) {
      return [];
    }
    list.add(const SizedBox(height: 5,));
    list.add(Text(widget.selectedPlugEvents[i]!.name, style: PlugItStyle.subtitleStyle,));
    list.add(const Divider(color: Colors.black));
    int idx = 1;
    for (Variable variable in widget.selectedPlugEvents[i]!.variables) {
      list.add(ElevatedButton(
        onPressed: () {
          Navigator.pop(context);
          widget.onVariableSelected(widget.selectedPlugEvents[i]!, variable, i);
        },
        child: Text("$idx - ${variable.displayName}", style: PlugItStyle.smallStyle),
      ));
      ++idx;
    }
    return list;
  }

  void displayMenu(BuildContext context) {
    if (widget.eventIdx == -1) {
      return;
    }
    
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context2) {
        List<Widget> list = [];
        for (int i = 0; i < (widget.eventIdx + 1); ++i) {
          list.addAll(getEventVariables(i, context2));
        }

        return ListView(
          children: list,
        );
      },

    );
  }

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
        onPressed: () {
          displayMenu(context);
        },
        child: Row(
          children: const [
            Text("Add variable"),
            Icon(Icons.add_rounded),
          ],
        ),
    );
  }
}
