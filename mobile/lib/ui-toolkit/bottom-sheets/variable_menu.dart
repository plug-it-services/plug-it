import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';

import 'package:mobile/models/field/Variable.dart';
import 'package:mobile/models/Event.dart';
import 'package:mobile/models/plug/PlugDetails.dart';
import 'package:mobile/models/plug/PlugEvent.dart';

import 'package:mobile/ui-toolkit/PlugItStyle.dart';



class VariableMenu extends StatefulWidget {
  final PlugDetails plug;
  final PlugEvent event;
  final void Function(Event, Variable, int idx) onVariableSelected;

  const VariableMenu({super.key,
    required this.onVariableSelected,
    required this.plug,
    required this.event,
  });

  @override
  State createState() => _StateVariableMenu();
}
class _StateVariableMenu extends State<VariableMenu>{

  bool active = false;

  Future<List<Event?>> setEventList() async
  {
    List<Event?> selectedPlugEvents = [];
    selectedPlugEvents = List.filled(1 + widget.plug.actions.length, null);
    if (widget.plug.event.id != "") {
      await setEventFromPlugEvent(widget.plug.event, true, 0, selectedPlugEvents);
    }
    int idx = 1;
    for (PlugEvent action in widget.plug.actions) {
      if (action.id != "") {
        await setEventFromPlugEvent(action, false, idx, selectedPlugEvents);
      }
      idx++;
    }
    return selectedPlugEvents;
  }
  Future setEventFromPlugEvent(PlugEvent ev, bool isTrigger, int idx, List<Event?> selectedPlugEvents) async {
    print("Fetching event data: ${ev.id}");
    selectedPlugEvents[idx] = await PlugApi.getEvent(ev.serviceName, ev.id, isTrigger: isTrigger);
    print("Fetched event data: ${ev.id}, and stored at $idx");
  }

  void displayMenu(BuildContext context) {
    setEventList().then((selectedPlugEvents) {
      showModalBottomSheet(
        context: context,
        builder: (BuildContext context2) {
          List<Widget> list = [];
          int idx = 0;
          for (var event in selectedPlugEvents) {
            if (idx != 0 && idx == widget.plug.actions.indexOf(widget.event))
              break;
            if (event == null || event.variables.isEmpty)
              continue;
            list.add(const SizedBox(height: 5,));
            list.add(Text(event.name, style: PlugItStyle.subtitleStyle,));
            list.add(const Divider(color: Colors.black));

            int var_idx = 1;
            for (Variable variable in event.variables) {
              list.add(ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  widget.onVariableSelected(event, variable, widget.plug.actions.indexOf(widget.event));
                },
                child: Text("$var_idx - ${variable.displayName}", style: PlugItStyle.smallStyle),
              ));
              ++var_idx;
            }
            ++idx;
          }
          return ListView(
            children: list,
          );
        },
      );
    });

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
