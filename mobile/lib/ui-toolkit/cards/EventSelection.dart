import 'package:dropdown_search/dropdown_search.dart';
import 'package:flutter/material.dart';
import 'package:mobile/PlugApi.dart';

import 'package:mobile/models/plug/PlugDetails.dart';
import 'package:mobile/models/plug/PlugEvent.dart';
import 'package:mobile/models/service/Service.dart';
import 'package:mobile/models/Event.dart';

import 'package:mobile/ui-toolkit/PlugItStyle.dart';
import 'package:mobile/ui-toolkit/bottom-sheets/event_selector.dart';
import 'package:mobile/ui-toolkit/bottom-sheets/service_selector.dart';
import 'package:mobile/ui-toolkit/cards/CardTitle.dart';


class EventSelection extends StatefulWidget {
  final List<Service> services;
  final bool isOpen;
  final void Function(bool state) onCardDeploy;
  final void Function(Event?) onEventSelected;
  final void Function(Service) onServiceSelected;
  final PlugDetails plug;
  final Service? selectedService;
  final Event? selectedEvent;
  final PlugEvent? editedEvent;
  final bool isTrigger;



  const EventSelection({super.key,
    required this.services,
    required this.isOpen,
    required this.onCardDeploy,
    required this.onEventSelected,
    required this.onServiceSelected,
    required this.plug,
    this.selectedService,
    this.selectedEvent,
    required this.editedEvent,
    required this.isTrigger,
  });

  @override
  State createState() => _StateEventSelection();
}
class _StateEventSelection extends State<EventSelection>{

  void onServiceSelected(value) {
    setState(() {
      widget.onServiceSelected(value);
      widget.onEventSelected(null);
    });
  }

  void onEventSelected(value) {
    setState(() {
      widget.onEventSelected(value);
    });
  }


  @override
  void initState() {
    super.initState();
    if (widget.selectedService == null) {
      return;
    }

  }

  List<Widget> getServiceSelection() {

    List<Widget> fields = [];

    if (!widget.isOpen) {
      return fields;
    }
    fields.add(const SizedBox(height: 5,));
    fields.add(ServiceMenu(
        onServiceSelected: onServiceSelected,
        selectedService: widget.selectedService,
        services: widget.services
    ));

    fields.add(const SizedBox(height: 15,));
    fields.add(EventMenu(
        onEventSelected: onEventSelected,
        selectedService: widget.selectedService,
        selectedEvent: widget.selectedEvent,
        isTrigger: widget.isTrigger,
    ));
    fields.add(const SizedBox(height: 15,));

    return fields;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10.0),
        child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            decoration: BoxDecoration(
                color: (widget.isOpen) ? PlugItStyle.primaryColor : Colors.transparent,
                borderRadius: BorderRadius.circular(4),
            ),
            child: CardTitle(
                label: "1 ${(widget.selectedEvent != null) ? "- ${widget.selectedEvent!.name.capitalize()}" : "- Select an Action "}",
                style: PlugItStyle.smallStyle,
                state: widget.isOpen,
                onPressed: () {
                  setState(() {
                    if (widget.isOpen) {
                      widget.onCardDeploy(false);
                    } else {
                      widget.onCardDeploy(true);
                    }
                  });
                },
                children: [
                  SizedBox(height: (widget.isOpen) ? 10 : 0,),
                  ...getServiceSelection(),
                ],
            ),
        ),
    );

  }
}
