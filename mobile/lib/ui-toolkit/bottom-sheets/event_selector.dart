import 'package:flutter/material.dart';

import 'package:mobile/PlugApi.dart';

import 'package:mobile/models/Event.dart';
import 'package:mobile/models/service/Service.dart';

import 'package:mobile/ui-toolkit/PlugItStyle.dart';


class EventMenu extends StatefulWidget {
  final Service? selectedService;
  final Event? selectedEvent;
  final List<Event> events;
  final void Function(Event service) onEventSelected;

  const EventMenu({super.key,
    required this.onEventSelected,
    required this.selectedService,
    required this.selectedEvent,
    required this.events,
  });

  @override
  State createState() => _StateEventMenu();
}
class _StateEventMenu extends State<EventMenu>{
  List<Event>? filteredEvents;
  String filter = "";
  final controller = TextEditingController();

  void setFilteredEvents(String filter)
  {
    filter = filter.toLowerCase();
    final filtered = widget.events
        .where((element) =>
        element.name.toLowerCase().contains(filter) || element.description.toLowerCase().contains(filter)
    ).toList();
    setState(() {
      filteredEvents = filtered;
    });
  }
  void displayMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context2) {
        List<Widget> list = [];
        for (Event event in filteredEvents ?? []) {
          list.add(Padding(
              padding: const EdgeInsets.all(10),
              child: ElevatedButton(
                onPressed: () {
                  widget.onEventSelected(event);
                  Navigator.pop(context);
                },
                child: Column(
                  children: [
                    Text(event.name, style: PlugItStyle.subtitleStyle),
                    const Divider(color: Colors.black,),
                    Text(event.description, style: PlugItStyle.smallStyle),
                  ],
                )
            )
          ));
        }

        return ListView(
          children: [
            Container(
              margin: const EdgeInsets.fromLTRB(16, 16, 16, 16),
              child: TextField(
                controller: controller,
                decoration: InputDecoration(
                    prefixIcon: const Icon(Icons.search),
                    hintText: 'Search an event',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide(color:PlugItStyle.primaryColor),
                    )
                ),
                onChanged: setFilteredEvents,
              ),
            ),
            ...list
          ],
        );
      },

    );
  }


  @override
  void initState()
  {
    filteredEvents = widget.events;
    super.initState();
  }
  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 5),
        child: ElevatedButton(
          onPressed: () {
            displayMenu(context);
          },
          child: Row(
            children: [
              (widget.selectedEvent == null) ? const Icon(Icons.search_rounded,) : const SizedBox(),
              (widget.selectedEvent == null) ? const SizedBox(width: 10,) : const SizedBox(),
              Text(
              (widget.selectedEvent == null) ? "Select an event" : widget.selectedEvent!.name,
              style: PlugItStyle.subtitleStyle
              ),
            ]
          )
        )
    );
  }
}
