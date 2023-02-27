import 'package:flutter/material.dart';

import 'package:mobile/PlugApi.dart';

import 'package:mobile/models/plug/PlugDetails.dart';
import 'package:mobile/models/plug/PlugEvent.dart';
import 'package:mobile/models/service/Service.dart';
import 'package:mobile/models/Event.dart';

import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/buttons/ScreenWidthButton.dart';
import 'package:mobile/ui-toolkit/cards/CardTitle.dart';
import 'package:mobile/ui-toolkit/cards/EventSelection.dart';
import 'package:mobile/ui-toolkit/cards/FieldsEditor.dart';


class ActionEditCard extends StatefulWidget {
  final List<Service> services;
  final bool isOpen;
  final bool isTrigger;
  final void Function() onCardDeploy;
  final PlugDetails plug;
  final PlugEvent editedEvent;
  final void Function(Event? selected, Service service) onEventSelected;
  final void Function(Service service) onServiceSelected;
  final void Function() onActionDeleted;
  final void Function() onActionAdded;

  const ActionEditCard({super.key,
    required this.isTrigger,
    required this.services,
    required this.isOpen,
    required this.onCardDeploy,
    required this.plug,
    required this.onEventSelected,
    required this.onServiceSelected,
    required this.onActionDeleted,
    required this.onActionAdded,
    required this.editedEvent,
  });

  @override
  State createState() => _StateActionEditCard();
}
class _StateActionEditCard extends State<ActionEditCard>{
  Service? selectedService;
  Event? selectedEvent;
  List<Event>? events;

  bool selectEventDeployed = true;
  bool editEventDeployed = false;

  void onServiceSelected(value) {
    setState(() {
      selectedService = value;
      widget.onServiceSelected(value);
    });
  }

  void onEventSelected(value) {
    setState(() {
      selectedEvent = value;
      widget.onEventSelected(value, selectedService!);
    });
  }

  String getLabel() {
    var idx = "";
    if (widget.isTrigger) {
      idx = "1";
    }
    else {
      idx = "${widget.plug.actions.indexOf(widget.editedEvent) + 2}";
    }

    if (selectedEvent != null) {
      var selected = " - ${selectedEvent!.name.capitalize()}";
      if (selected.length > 27) {
        selected = "${selected.substring(0, 27)}...";
      }
      idx += selected;
    }
    else {
      if (widget.isTrigger) {
        idx += " - Trigger";
      }
      else {
        idx += " - Action";
      }
    }
    return idx;
  }


  void getCurrentData(String serviceName, String eventId) {
    if (serviceName != '' && (selectedService == null || selectedService!.name != serviceName)) {
      PlugApi.getServiceByName(serviceName).then((value) {
        setState(() {
          selectedService = value;
        });
      });
    }
    if (eventId != '' && (selectedEvent == null || selectedEvent!.id != eventId)) {
      PlugApi.getEvent(serviceName, eventId, isTrigger: widget.isTrigger).then((value) {
        setState(() {
          selectedEvent = value;
        });
      });
    }
  }


  List<Widget> getBody() {
    if (widget.isOpen) {
      return [
        const SizedBox(height: 20,),
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
          editedEvent: widget.editedEvent,
          selectedEvent: selectedEvent,
          selectedService: selectedService,
          isTrigger: widget.isTrigger,
        ),
        const SizedBox(height: 20,),
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
          editedEvent: widget.editedEvent,
          isTrigger: widget.isTrigger,
          plug: widget.plug,
        ),
        const SizedBox(height: 20,),
      ];
    }
    return [];
  }

  @override
  void initState() {
    clearData();
    getCurrentData(widget.editedEvent.serviceName, widget.editedEvent.id);
    super.initState();
  }

  @override
  void dispose()
  {
    clearData();
    super.dispose();
  }

  void clearData()
  {
      if (widget.editedEvent.serviceName == '' && selectedService != null) {
        setState(() {
          selectedService = null;
        });
      }
      if (widget.editedEvent.id == '' && selectedEvent != null) {
        setState(() {
          selectedEvent = null;
        });
      }
  }


  @override
  Widget build(BuildContext context) {
    clearData();
    getCurrentData(widget.editedEvent.serviceName, widget.editedEvent.id);
    return Padding(
        padding: const EdgeInsets.all(10),
        child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            decoration: BoxDecoration(
                color: PlugItStyle.cardColor,
                borderRadius: BorderRadius.circular(8)
            ),
            child: Column(
              children: [
                CardTitle(
                  label: getLabel(),
                  state: widget.isOpen,
                  onPressed: () {
                    widget.onCardDeploy();
                  },
                  isIconButtonPresent: (!widget.isTrigger),
                  onIconPressed: widget.onActionDeleted,
                  children: [
                    ...getBody(),
                  ],
                ),

              ]
            )
        )
    );

  }
}
