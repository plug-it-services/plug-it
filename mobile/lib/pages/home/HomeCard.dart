import 'package:flutter/material.dart';
import '../../models/plug/Plug.dart';
import '../../models/service/Service.dart';


class HomeCard extends StatefulWidget {
  Text title;
  List<Text> description;
  HomeCard({super.key, required this.title, required this.description});

  @override
  State<HomeCard> createState() => _HomeCardState();
}

class _HomeCardState extends State<HomeCard> {
  @override
  Widget build(BuildContext context) {
    return
          Padding(
              padding: const EdgeInsets.all(8.0),
              child: Container(
                  decoration: BoxDecoration(
                    color: Colors.blue.shade700,
                    border: Border.all(
                      width: 0,
                      color: Colors.transparent
                    ),
                    borderRadius: const BorderRadius.all(Radius.circular(5))
                  ),
                  height: 120,
                  child: Column(
                        children: [
                          Center(
                              child: widget.title
                          ),
                          const Center(
                              child: Padding(
                                  padding: EdgeInsets.all(8.0),
                                  child:Divider(color: Colors.black, thickness: 1,)
                              )
                          ),
                          const SizedBox(height: 5,),
                          Center(
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children:widget.description.map((e) => Center(child:e)).toList())
                            ),
                        ],
                      )
                  )
          );
  }
}