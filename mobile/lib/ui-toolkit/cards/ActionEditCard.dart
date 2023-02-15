import 'package:flutter/material.dart';

import 'package:mobile/PlugApi.dart';

import 'package:mobile/models/plug/PlugDetails.dart';
import 'package:mobile/models/plug/PlugEvent.dart';
import 'package:mobile/models/service/Service.dart';
import 'package:mobile/models/Event.dart';

import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/cards/CardTitle.dart';
import 'package:mobile/ui-toolkit/cards/EventSelection.dart';
import 'package:mobile/ui-toolkit/cards/FieldsEditor.dart';


class ActionEditCard extends StatefulWidget {
  final List<Service> services;
  final bool isOpen;
  final void Function() onCardDeploy;
  final PlugDetails plug;
  final int actionIdx;
  final List<Event?> selectedPlugEvents;
  final void Function() onEventSelected;

  const ActionEditCard({super.key,
    required this.services,
    required this.isOpen,
    required this.onCardDeploy,
    required this.plug,
    required this.actionIdx,
    required this.onEventSelected,
    required this.selectedPlugEvents
  });

  @override
  State createState() => _StateActionEditCard();
}
class _StateActionEditCard extends State<ActionEditCard>{
  Service? selectedService;
  Event? selectedEvent;
  List<Event>? events;
  bool deployed = false;
  bool selectEventDeployed = true;
  bool editEventDeployed = false;

  void onServiceSelected(value) {
    setState(() {
      selectedService = value;
      if (widget.actionIdx != -1) {
        PlugApi.getServiceActions(selectedService!.name).then((events)
        {
          _setEvents(events ?? []);
        });
      }
      else {
        PlugApi.getServiceEvents(selectedService!.name).then((events) =>
        {
          _setEvents(events ?? [])
        });

      }
    });
  }

  void onEventSelected(value) {
    setState(() {
      selectedEvent = value;
      if (value == null) {
        if (widget.actionIdx == -1) {
          widget.plug.event = null;
        }
        else {
          widget.plug.actions[widget.actionIdx] = PlugEvent(id: '', serviceName: '', fields: [],);
        }
        widget.onEventSelected();
        return;
      }
      var ev = PlugEvent.fromEventService(event: value, serviceName: selectedService!.name);
      if (widget.actionIdx == -1) {
        widget.plug.event = ev;
      }
      else {
        widget.plug.actions[widget.actionIdx] = ev;
      }
    });
    widget.onEventSelected();
  }

  String getLabel() {
    if (widget.actionIdx == -1) {
      return "1 --| Trigger";
    }
    return "${widget.actionIdx + 2} --| Action";
  }

  PlugEvent? getEditedEvent() {
    if (widget.actionIdx == -1) {
      return (widget.plug.event == null ||(widget.plug.event!.id == "" && widget.plug.event!.serviceName == "")) ? null : widget.plug.event!;
    }
    else {
      return (widget.plug.actions[widget.actionIdx].id == "" && widget.plug.actions[widget.actionIdx].serviceName == "") ? null : widget.plug.actions[widget.actionIdx];
    }
  }

  void _setEvents(List<Event> events) {
    setState(() {
      this.events = events;
    });
  }
  void getCurrentData(String serviceName, String eventId) {
    PlugApi.getServiceByName(serviceName).then((value) {
      setState(() {
        selectedService = value;
      });
    });
    PlugApi.getEvent(serviceName, eventId, isTrigger: widget.actionIdx == -1).then((value) {
      setState(() {
        selectedEvent = value;
      });
    });
  }
  List<Widget> getBody() {
    if (widget.isOpen) {
      return [
        //const Divider(color: Colors.black),
        SizedBox(height: 20,),
        EventSelection(
          services: widget.services,
          isOpen: selectEventDeployed,
          onCardDeploy: (value) => {
            setState(() {
              selectEventDeployed = value;
              editEventDeployed = !selectEventDeployed;
            })
          },
          onEventSelected: onEventSelected,
          onServiceSelected: onServiceSelected,
          plug: widget.plug,
          editedEvent: getEditedEvent(),
          selectedEvent: selectedEvent,
          selectedService: selectedService,
          events: events,
        ),
        SizedBox(height: 20,),
        FieldsEditor(
          services: widget.services,
          isOpen: editEventDeployed,
          onCardDeploy: (value) => {
            setState(() {
              editEventDeployed = value;
              selectEventDeployed = !editEventDeployed;
            })
          },
          selectedEvent: selectedEvent,
          editedEvent: getEditedEvent(),
          selectedPlugEvents: widget.selectedPlugEvents,
          eventIdx: widget.actionIdx,
        ),
        SizedBox(height: 20,)
      ];
    }
    return [];
  }

  @override
  void initState() {
    if (widget.actionIdx == -1 && widget.plug.event != null && widget.plug.event!.id != "" && widget.plug.event!.serviceName != "") {
      getCurrentData(widget.plug.event!.serviceName, widget.plug.event!.id);
    }
    if (widget.actionIdx != -1 && widget.plug.actions[widget.actionIdx].id != "" && widget.plug.actions[widget.actionIdx].serviceName != "") {
      getCurrentData(widget.plug.actions[widget.actionIdx].serviceName, widget.plug.actions[widget.actionIdx].id);
    }
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.all(10),
        child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            decoration: BoxDecoration(
                color: PlugItStyle.cardColor,
                borderRadius: BorderRadius.circular(8)
            ),
            child: CardTitle(
              label: "${getLabel()} ${(selectedService != null) ? "- ${selectedService!.name.capitalize()}" : ""}",
              state: widget.isOpen,
              onPressed: () {
                widget.onCardDeploy();
              },
              children: [
                ...getBody(),
              ],
            ),
        )
    );

  }
}
